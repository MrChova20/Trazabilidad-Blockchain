const {
    Client,
    ContractExecuteTransaction,
    Hbar,
    ContractId,
    PrivateKey,
    ContractFunctionParameters,
} = require("@hashgraph/sdk");
 
async function addUserToContract(temperatura, humedad) {
    const client = Client.forTestnet();
 
    // Datos de la cuenta HBAR
    const accountID = "0.0.4515903";
    const PrivateKeyHex = "0xd36e3b1a69b19071146b158789200c275e0c713545387a2561066773bd78bb4f";
    const privateKey = PrivateKey.fromStringED25519(PrivateKeyHex);
 
    client.setOperator(accountID, privateKey);
 
    // El Contract ID es fijo según la modificación solicitada
    const contractId = "0.0.4612570";
 
    // El ID de usuario es fijo o puede ser otro argumento si lo necesitas
    const idRegistro = 1; // Puedes cambiar esto si necesitas un ID de usuario dinámico
 
    const contractIdObj = ContractId.fromString(contractId);
    const gas = 100000; // Ajusta el gas según sea necesario
 
    try {
        // Prepara los parámetros de la función
        const functionParameters = new ContractFunctionParameters()
            .addUint256(parseInt(idRegistro, 10))
            .addString(humedad)
            .addInt256(parseInt(temperatura, 10));
        // Crea y envía la transacción para llamar a la función del contrato
        const contractExecTx = await new ContractExecuteTransaction()
            .setContractId(contractIdObj)
            .setGas(gas)
            .setFunction("addRegister", functionParameters)
            .setMaxTransactionFee(new Hbar(10)) // Ajusta según sea necesario
            .execute(client);
 
        const receipt = await contractExecTx.getReceipt(client);
        console.log(`Estado de la transacción: ${receipt.status.toString()}`);
    } catch (error) {
        console.error("Error al ejecutar la transacción:", error);
    } finally {
        // Finalizamos el proceso
        process.exit(0);
    }
}
 
const args = process.argv.slice(2);
const temperatura = args[0];
const humedad = args[1];
 
if (temperatura === undefined || humedad === undefined) {
    console.error("Error: los argumentos de temperatura o humedad no están definidos.");
    process.exit(1);
}
 
console.log(`Temperatura: ${temperatura}, Humedad: ${humedad}`);
 
addUserToContract(temperatura, humedad).catch(error => {
    console.error("Error:", error);
    process.exit(1); // Salida por error
});