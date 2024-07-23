const {
    Client,
    ContractExecuteTransaction,
    Hbar,
    ContractId,
    PrivateKey,
    ContractFunctionParameters, // Asegúrate de incluir esto en tus importaciones
} = require("@hashgraph/sdk");
 
const readline = require("readline");
 
// Crea una interfaz readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
 
// Función para hacer preguntas al usuario
function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}
 
async function addValuesToContract() {
    const client = Client.forTestnet();
 
    // Solicita al usuario que ingrese las credenciales
   /* const accountId = await askQuestion("Ingrese su Account ID (ejemplo: 0.0.1234): ");
    const privateKeyHex = await askQuestion("Ingrese su clave privada HEX: ");*/
        //Datos de la propia HBAR ACCOUNT!
        const accountID = "0.0.4515903";
        const PrivateKeyHex = "0xd36e3b1a69b19071146b158789200c275e0c713545387a2561066773bd78bb4f";
        const privateKey = PrivateKey.fromStringED25519(PrivateKeyHex) //<-- Escoger la encriptación correcta :)
   
        client.setOperator(accountID, privateKey);
   
    // El Contract ID es fijo según la modificación solicitada
    const contractId = "0.0.4612570";
    
    const idRegistro = await askQuestion("el Registro es  : ");
    const humedad = await askQuestion("La humedad es de : ")   ;
    const temperatura = await askQuestion("La temperatura es de : ");
   
 
    //const privateKey = PrivateKey.fromString(privateKeyHex);
    //client.setOperator(accountId, privateKey);
 
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
            .setFunction("addRegister", functionParameters) // Modificado para usar functionParameters
            .setMaxTransactionFee(new Hbar(10)) // Ajusta según sea necesario
            .execute(client);
 
            const receipt = await contractExecTx.getReceipt(client);
            console.log(`Estado de la transacción: ${receipt.status.toString()}`);
        } catch (error) {
            console.error("Error al ejecutar la transacción:", error);
        } finally {
            rl.close();
        }
   
            //Finalizamos el proceso
            process.exit(0);
    }
   
    addValuesToContract().catch(error => {
        console.error("Error:" , error);
        process.exit(1); //Salida por error
    })
   