module.exports = MBusFrame;

function MBusFrame(message) {

      this.sc = message.substr(0,2);
      this.l = message.substr(2,2);
      this.c_field = message.substr(8,2);
      this.a_field = message.substr(10,2);
      this.ci_field = message.substr(12,2);
      this.data_header = message.substr(14,8);
      this.version_id = message.substr(26,2);
      this.access_number = message.substr(30,2);
      this.status_byte = message.substr(32,2);
      this.signature_field = message.substr(34,4);
      this.checksum = message.substr(message.length - 4, 2);

      var manbin = hex2bin(message.substr(24,2)) + hex2bin(message.substr(22,2));
      this.manufacturer = ( String.fromCharCode(parseInt("010" + manbin.substr(1,5),2)) + String.fromCharCode(parseInt("010" + manbin.substr(6,5),2)) + String.fromCharCode(parseInt("010" + manbin.substr(11,5),2)));

      //Device type
      switch (message.substr(28,2)) {
            case "00":
                this.device_type = "Other";
                break;
            case "01":
                this.device_type = "Oil";
                break;
                case "02":
                this.device_type = "Electricity";
                break;
              case "03":
                this.device_type = "Gas";
                break;
              case "04":
                this.device_type = "Heat";
                break;
              case "05":
                this.device_type = "Steam";
                break;
              case "06":
                this.device_type = "Warm water";
                break;
              case "07":
                this.device_type = "Water";
                break;
              case "08":
                this.device_type = "Heat cost allocator";
                break;
              case "09":
                this.device_type = "Compressed air";
                break;
              case "0a":
                this.device_type = "Cooling load meter (Volume measured at return temperature)";
                break;
              case "0b":
                this.device_type = "Cooling load meter (Volume measured at flow temperature: inlet)";
                break;
              case "0c":
                this.device_type = "Heat";
                break;
              case "0d":
                this.device_type = "Heat / Cooling load meter";
                break;
              case "0e":
                this.device_type = "Bus / System component";
                break;
              case "0f":
                this.device_type = "Unknown Medium";
                break;
              case "15":
                this.device_type = "Hot water";
                break;
              case "16":
                this.device_type = "Cold water";
                break;
              case "17":
                this.device_type = "Dual register (hot/cold) water meter";
                break;
              case "18":
                this.device_type = "Pressure";
                break;
              case "19":
                  this.device_type = "A/D Converter";
                  break;
              default:
                this.device_type = "Reserved";
                break;
    }
    this.dataBlocks = [];

      var dataBlocks_message = message.substr(38, message.length - 42);


      while (dataBlocks_message.length > 0) {

          var dataBlock = new MBusDataBlock();

          dataBlocks_message = [dataBlocks_message];
          dataBlock.popDataBlockFromMessage( dataBlocks_message );
          dataBlocks_message = dataBlocks_message[0];

          this.dataBlocks.push(dataBlock);
      }
}

//Utilities

function hex2bin(hex){
    return ("00000000" + (parseInt(hex, 16)).toString(2)).substr(-8);
}


function bcd2dec(val) {

  var res = "";
  for(var i = val.length - 2; i >= 0; i-=2){
    var hex = val.substr(i, 2);
    res += hex;
  }
  return res;
}

function int2dec(val){

  var res = "";
  for(var i = val.length - 2; i >= 0; i-=2){
    var hex = val.substr(i, 2);
    res += hex;
  }
  return parseInt(res,16).toString(10);
}


//MBus Data Block

function MBusDataBlock() {
  //Extract first dataBlock

  this.dif = "";
  this.dife = [];

  this.vif = "";
  this.vife = [];

  this.data = "";

  this.data_block_length = 0;
  this.data_type = "";
  this.isBCD = false;

  this.function_name = "";
  this.storage_number = "";
  this.tariff = "";
  this.device_unit = "";

  this.measure_unit = "";
  this.measure_desc = "";
  this.multiplier = 1;

  this.extra = "";
}

MBusDataBlock.prototype.popDataBlockFromMessage = function(inmessage){

  var message = inmessage[0];
  var i = 0;

  //DIF
  this.dif = message.substr(i,2);
  i += 2;

  //Special function
  if(this.dif == "0f"){
    this.data = message.substr(i, message.length - i);
    i += this.data.length;

    inmessage[0] = message.substr(i, message.length - i);

    this.extra = "Start of manufacturer specific data structures to end of user data";
    return;
  }

  var bin_dif = hex2bin(this.dif);

  while (bin_dif[0] == 1) {
    var dife = message.substr(i, 2);
    var bin_dif = hex2bin(dife);
    this.dife.push(dife);
    i += 2;
  }

  this.DIFAnalysis();
  this.DIFEAnalysis();

  //VIF
  this.vif = message.substr(i,2);
  i += 2;

  var bin_vif = hex2bin(this.vif);

  while (bin_vif[0] == 1) {

    var vife = message.substr(i, 2);
    var bin_vif = hex2bin(vife);
    this.vife.push(vife);
    i += 2;
  }

  this.VIFAnalysis();

  //Data
  if(this.isBCD){
    this.data = (parseInt(bcd2dec(message.substr(i, this.data_block_length))) * this.multiplier).toString();
  }
  else {
    this.data = (parseInt(int2dec(message.substr(i, this.data_block_length))) * this.multiplier).toString();
  }
  i += this.data_block_length;

  inmessage[0] = message.substr(i, message.length - i);
}

//DIF Analysis

MBusDataBlock.prototype.DIFAnalysis = function(){

  var hexDif = hex2bin(this.dif);

  //Function

  switch (hexDif.substr(2, 2)){

    case "00":
      this.function_name = "Inst. value";
      break;

    case "01":
      this.function_name = "Max value";
      break;

    case "10":
      this.function_name = "Min value";
      break;

    case "11":
      this.function_name = "Value during error state";
      break;
  }

  //Storage

  this.storage_number = this.storage_number + hexDif.substr(1, 1);


  //Data length

  switch (hexDif.substr(hexDif.length - 4, 4)){

    //No data
    case "0000":
      this.data_block_length = 0;
      this.data_type = "No data";
      break;

    //8 bit integer
    case "0001":
      this.data_block_length = 2;
      this.data_type = "8 bit integer";
      break;

    //16 bit integer
    case "0010":
      this.data_block_length = 4;
      this.data_type = "16 bit integer";
      break;

    //24 bit integer
    case "0011":
      this.data_block_length = 6;
      this.data_type = "24 bit integer";
      break;

    //32 bit integer
    case "0100":
      this.data_block_length = 8;
      this.data_type = "32 bit integer";
      break;

    //48 bit integer
    case "0110":
      this.data_block_length = 12;
      this.data_type = "48 bit integer";
      break;

    //64 bit integer
    case "0111":
      this.data_block_length = 16;
      this.data_type = "64 bit integer";
      break;

    //2 BCD
    case "1001":
      this.data_block_length = 2;
      this.data_type = "2 BCD";
      this.isBCD = true;
      break;

    //4 BCD
    case "1010":
      this.data_block_length = 4;
      this.data_type = "4 BCD";
      this.isBCD = true;
      break;

    //6 BCD
    case "1011":
      this.data_block_length = 6;
      this.data_type = "6 BCD";
      this.isBCD = true;
      break;

    //8 BCD
    case "1100":
      this.data_block_length = 8;
      this.data_type = "8 BCD";
      this.isBCD = true;
      break;

    //12 BCD
    case "1110":
      this.data_block_length = 12;
      this.data_type = "12 BCD";
      this.isBCD = true;
      break;

    case "1000":
    case "0101":
    case "1101":
      this.data_block_length = -1;
      this.data_type = "Unknown";
      break;

    //Special function
    case "1111":
      this.data_block_length = -100;
      this.data_type = "Special function";
      break;
  }
};


MBusDataBlock.prototype.DIFEAnalysis = function(){

  if(this.dife.length > 0 ){

    this.dife.forEach(function(element){

      var hexDife = hex2bin(element);

      //Storage
      this.storage_number = hexDife.substr(hexDife.length - 4, 4) + this.storage_number;

      //Tariff
      this.tariff = hexDife.substr(2, 2) + this.tariff;

      //unit
      this.device_unit = hexDife.substr(1, 1) + this.device_unit;
    }, this);
  }
};


MBusDataBlock.prototype.VIFAnalysis = function(){

    var hexvif = hex2bin(this.vif);

    switch (hexvif.substr(1, hexvif.length -1)){
        case "0000000":
        case "0000001":
        case "0000010":
        case "0000011":
        case "0000100":
        case "0000101":
        case "0000110":
        case "0000111":
          this.measure_unit = "Wh";
          console.log("multiplier: " + hexvif);
          this.multiplier = Math.pow(10, parseInt(hexvif.substr(hexvif.length - 3, 3), 2) - 3);

          if(this.multiplier >= 1000){
            this.multiplier -= 1000;
            if(this.multiplier == 0) {
                this.multiplier = 1;
            }
            this.measure_unit = "kWh";
          }

          this.measure_desc = "Energy";
          break;

        case "0001000":
        case "0001001":
        case "0001010":
        case "0001011":
        case "0001100":
        case "0001101":
        case "0001110":
        case "0001111":
          this.measure_unit = "J";
          this.multiplier = Math.pow(10, parseInt(hexvif.substr(hexvif.length - 3, 3), 2));

          if(this.multiplier >= 1000){
            this.multiplier -= 1000;
            if(this.multiplier == 0) {
                this.multiplier = 1;
            }
            this.measure_unit = "kJ";
          }

          this.measure_desc = "Energy";
          break;

        case "0010000":
        case "0010001":
        case "0010010":
        case "0010011":
        case "0010100":
        case "0010101":
        case "0010110":
        case "0010111":
          this.measure_unit = "m³";
          this.multiplier = Math.pow(10, parseInt(hexvif.substr(hexvif.length - 3, 3), 2) - 6);
          this.measure_desc = "Volume";
          break;

        case "0011000":
        case "0011001":
        case "0011010":
        case "0011011":
        case "0011100":
        case "0011101":
        case "0011110":
        case "0011111":
          this.measure_unit = "Kg";
          this.multiplier = Math.pow(10, parseInt(hexvif.substr(hexvif.length - 3, 3), 2) - 3);
          this.measure_desc = "Mass";
          break;

        case "0100000":
        case "0100001":
        case "0100010":
        case "0100011":
          this.multiplier = 1;
          this.measure_desc = "On Time";
          var cod = hexvif.substr(hexvif.length - 2, 2);
          if(cod == "00"){
            this.measure_unit = "seconds";
          } else if (cod == "01") {
            this.measure_unit = "minutes";
          } else if (cod == "10") {
            this.measure_unit = "hours";
          } else if (cod == "11") {
            this.measure_unit = "days";
          }
          break;

        case "0100100":
        case "0100101":
        case "0100110":
        case "0100111":
          this.multiplier = 1;
          this.measure_desc = "Operating time";
          var cod = hexvif.substr(hexvif.length - 2, 2);
          if(cod == "00"){
            this.measure_unit = "seconds";
          } else if (cod == "01") {
            this.measure_unit = "minutes";
          } else if (cod == "10") {
            this.measure_unit = "hours";
          } else if (cod == "11") {
            this.measure_unit = "days";
          }
          break;

        case "0101000":
        case "0101001":
        case "0101010":
        case "0101011":
        case "0101100":
        case "0101101":
        case "0101110":
        case "0101111":
          this.measure_unit = "W";
          this.multiplier = Math.pow(10, parseInt(hexvif.substr(hexvif.length - 3, 3), 2) - 3);
          if(this.multiplier >= 1000){
            this.multiplier -= 1000;
              if(this.multiplier == 0) {
                  this.multiplier = 1;
              }
            this.measure_unit = "kW";
          }
          this.measure_desc = "Power";
          break;

        case "0110000":
        case "0110001":
        case "0110010":
        case "0110011":
        case "0110100":
        case "0110101":
        case "0110110":
        case "0110111":
          this.measure_unit = "J/h";
          this.multiplier = Math.pow(10, parseInt(hexvif.substr(hexvif.length - 3, 3), 2));
          if(this.multiplier >= 1000){
            this.multiplier -= 1000;
              if(this.multiplier == 0) {
                  this.multiplier = 1;
              }
            this.measure_unit = "kJ/h"; 
          }
          this.measure_desc = "Power";
          break;

        case "0111000":
        case "0111001":
        case "0111010":
        case "0111011":
        case "0111100":
        case "0111101":
        case "0111110":
        case "0111111":
            this.measure_unit = "m³/h";
            this.multiplier = Math.pow(10, parseInt(hexvif.substr(hexvif.length - 3, 3), 2) - 6);
            this.measure_desc = "Volume Flow";
            break;

        case "1000000":
        case "1000001":
        case "1000010":
        case "1000011":
        case "1000100":
        case "1000101":
        case "1000110":
        case "1000111":
          this.measure_unit = "m³/min";
          this.multiplier = Math.pow(10, parseInt(hexvif.substr(hexvif.length - 3, 3), 2) - 7);
          this.measure_desc = "Volume Flow ext.";
          break;

        case "1001000":
        case "1001001":
        case "1001010":
        case "1001011":
        case "1001100":
        case "1001101":
        case "1001110":
        case "1001111":
          this.measure_unit = "m³/s";
          this.multiplier = Math.pow(10, parseInt(hexvif.substr(hexvif.length - 3, 3), 2) - 9);
          this.measure_desc = "Volume Flow ext.";
          break;

        case "1010000":
        case "1010001":
        case "1010010":
        case "1010011":
        case "1010100":
        case "1010101":
        case "1010110":
        case "1010111":
          this.measure_unit = "kg/h";
          this.multiplier = Math.pow(10, parseInt(hexvif.substr(hexvif.length - 3, 3), 2) - 3);
          this.measure_desc = "Mass flow";
          break;

        case "1011000":
        case "1011001":
        case "1011010":
        case "1011011":
          this.measure_unit = "°C";
          this.multiplier = Math.pow(10, parseInt(hexvif.substr(hexvif.length - 2, 2), 2) - 3);
          this.measure_desc = "Flow temperature";
          break;

        case "1011100":
        case "1011101":
        case "1011110":
        case "1011111":
          this.measure_unit = "°C";
          this.multiplier = Math.pow(10, parseInt(hexvif.substr(hexvif.length - 2, 2), 2) - 3);
          this.measure_desc = "Return temperature";
          break;

        case "1100000":
        case "1100001":
        case "1100010":
        case "1100011":
          this.measure_unit = "K";
          this.multiplier = Math.pow(10, parseInt(hexvif.substr(hexvif.length - 2, 2), 2) - 3);
          this.measure_desc = "Temperature difference";
          break;

        case "1100100":
        case "1100101":
        case "1100110":
        case "1100111":
          this.measure_unit = "°C";
          this.multiplier = Math.pow(10, parseInt(hexvif.substr(hexvif.length - 2, 2), 2) - 3);
          this.measure_desc = "External temperature";
          break;

        case "1101000":
        case "1101001":
        case "1101010":
        case "1101011":
          this.measure_unit = "bar";
          this.multiplier = Math.pow(10, parseInt(hexvif.substr(hexvif.length - 2, 2), 2) - 3);
          this.measure_desc = "Pressure";
          break;

        case "1101100":
        case "1101101":
            this.measure_unit = "time";
            this.multiplier = 1;
            this.measure_desc = "Time Point";
            break;

        case "1101110":
            this.measure_unit = "";
            this.multiplier = 1;
            this.measure_desc = "Units for H.C.A.";
            break;

        case "1101111":
            this.measure_unit = "";
            this.multiplier = 1;
            this.measure_desc = "Reserved";
            break;

        case "1110000":
        case "1110001":
        case "1110010":
        case "1110011":
            this.measure_unit = "time";
            this.multiplier = 1;
            this.measure_desc = "Averaging duration";
            break;

        case "1110100":
        case "1110101":
        case "1110110":
        case "1110111":
            this.measure_unit = "time";
            this.multiplier = 1;
            this.measure_desc = "Actuality duration";
            break;

        case "1111000":
            this.measure_unit = "";
            this.multiplier = 1;
            this.measure_desc = "Fabrication No";
            break;

        case "1111001":
            this.measure_unit = "";
            this.multiplier = 1;
            this.measure_desc = "Identification";
            break;

        case "1111010":
            this.measure_unit = "";
            this.multiplier = 1;
            this.measure_desc = "Bus address";
            break;

        case "1111100":
            this.measure_unit = "";
            this.multiplier = 1;
            this.measure_desc = "";
            break;

        case "1111101":
            this.measure_unit = "";
            this.multiplier = 1;
            this.measure_desc = "";
            break;

        case "1111011":
        case "1111110":
            this.measure_unit = "";
            this.multiplier = 1;
            this.measure_desc = "Not managed";
            break;

        case "1111111":
            this.measure_unit = "";
            this.multiplier = 1;
            this.measure_desc = "Manufacturer specific";
            break;
    }
};

//Config caleffi: 6808086853FF51017C0150007116
//Config BCD: 6808086853FF51017C0150017216
