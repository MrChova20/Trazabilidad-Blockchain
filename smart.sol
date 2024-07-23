pragma solidity ^0.8.0;

contract baseDeDatos {
    struct data{
        string humedad;
        int temperatura;
    }
    mapping(uint => data) private registro;
    event registroAnyadido (uint idRegister, string  humedad, int temperatura);

    function addRegister(uint _idRegister,string memory  _humedad, int _temperatura) public {
        registro[_idRegister] = data(_humedad,_temperatura);
        emit registroAnyadido(_idRegister, _humedad, _temperatura);

    }
    function getRegister(uint _idRegister) public view returns (string memory ,int) {
                require(bytes(registro[_idRegister].humedad).length>0,"el registro no existe");
                
                return (registro[_idRegister].humedad,registro[_idRegister].temperatura);
    }
}