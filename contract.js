const {
    Client, ContractCreateTransaction, FileCreateTransaction, Hbar, PrivateKey} = require("@hashgraph/sdk");

const fs = require("fs");

async function deployContract(){
    const client = Client.forTestnet();

    const accountID = "0.0.4515903";
    const PrivateKeyHex = "0xd36e3b1a69b19071146b158789200c275e0c713545387a2561066773bd78bb4f";
    const privateKey = PrivateKey.fromStringED25519(PrivateKeyHex);
    

    client.setOperator(accountID,privateKey);
    const bytecode = fs.readFileSync("trybin.bin");

 
    const fileCreateTx = new FileCreateTransaction()
        .setContents(bytecode)
        .setMaxTransactionFee(new Hbar(10)); // Ajusta la tarifa de transacción según sea necesario
    const submitFileCreateTx = await fileCreateTx.execute(client);
    const fileCreateRx = await submitFileCreateTx.getReceipt(client);
    const bytecodeFileId = fileCreateRx.fileId;//Hash de vuelta
 
    const contractInstantiateTx = new ContractCreateTransaction()
        .setBytecodeFileId(bytecodeFileId)
        .setGas(100000) // Ajusta el gas según sea necesario
        .setMaxTransactionFee(new Hbar(10)); // Ajusta la tarifa de transacción según sea necesario
    const submitInstantiateTx = await contractInstantiateTx.execute(client);
    const contractInstantiateRx = await submitInstantiateTx.getReceipt(client);
    const contractId = contractInstantiateRx.contractId;
 
    console.log(`Contrato desplegado con éxito en el ID: ${contractId}`);
 
    // Finaliza el proceso con éxito
    process.exit(0);
}
 
deployContract().catch(error => {
    console.error("Error al desplegar el contrato:", error);
    process.exit(1); // Finaliza el proceso con un código de error
});
 




