const {
    Client,
    ContractExecuteTransaction,
    ContractCallQuery,
    Hbar,
    ContractId,
    PrivateKey,
    ContractFunctionParameters, // Asegúrate de incluir esto en tus importaciones
} = require("@hashgraph/sdk");
 
// Función para solicitar información al usuario
const askQuestion = (question) => {
    const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout
    });
 
    return new Promise(resolve => readline.question(question, ans => {
        readline.close();
        resolve(ans);
    }));
}
 
const getValues = async () => {
    const client = Client.forTestnet();
   
        //Datos de la propia HBAR ACCOUNT!
        const accountID = "0.0.4515903";
        const PrivateKeyHex = "0xd36e3b1a69b19071146b158789200c275e0c713545387a2561066773bd78bb4f";
        const privateKey = PrivateKey.fromStringED25519(PrivateKeyHex) //<-- Escoger la encriptación correcta :)
   
        client.setOperator(accountID, privateKey);
 
    client.setOperator(accountID, privateKey);
 
    // El Contract ID es fijo según la modificación solicitada
    const contractId = "0.0.4612570";
    const idRegistro = await askQuestion("Ingrese el ID de Registro a consultar: ");
 
    try {
        // Crear y configurar la consulta para llamar a la función del contrato
        const query = new ContractCallQuery()
            .setContractId(contractId)
            .setGas(100000) // Ajusta el gas según sea necesario
            .setFunction("getRegister", new ContractFunctionParameters().addUint256(parseInt(idRegistro)))
            .setQueryPayment(new Hbar(2)); // Ajusta el pago de la consulta según sea necesario, más bajo para pruebas
 
        // Ejecutar la consulta
        const result = await query.execute(client);
 
        // Decodificar el resultado de la llamada
        const humedad = result.getString(0);
        const temperatura = result.getInt256(1); // Asegúrate de usar el índice correcto para obtener la nota
 
        console.log(`Humedad: ${humedad}, Temperatura: ${temperatura}`);
         // Finalizamos el proceso correctamente después de imprimir los resultados
         process.exit(0);
        return { humedad, temperatura };
    } catch (error) {
        console.error("Error retrieving data from contract:", error);
        throw error;
    }
         
};
 
getValues().catch(error => {
    console.error("Error:", error);
    process.exit(1); // Salida por error
});
 
 