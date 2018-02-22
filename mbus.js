

module.exports = {

    MBusStatusEnum: Object.freeze({"pending":1, "waitingForAck":2, "waitingForData":3}),

    /*--- Params ---*/

    MBusStatus : 1,
    currentPrimaryAddress : null,


    /*--- Main functions---*/

    ackForPrimaryAddress: function(primaryAddress){
        exports.currentPrimaryAddress = primaryAddress;
        return this.createTelegram("40" + primaryAddress);
    },

    dataForPrimaryAddress: function(primaryAddress){
        exports.currentPrimaryAddress = primaryAddress;
        return this.createTelegram("7B" + primaryAddress);
    },


    /*-- Support functions ---*/

    createTelegram: function(telegramBody) {
        var cs = this.checksum(telegramBody);
        return ("10" + telegramBody + cs +"16");
    },


    checksum: function(message) {
        if(message.length%2 === 0) {

            var sum = 0;
            for (var c = 0; c < message.length; c += 2) {
                sum += parseInt(message.substr(c, 2), 16);
            }

            var res = (sum % 256).toString(16);

            if (res.length == 1) {
                res = "0" + res;
            }

            return res;
        }
    }


    checkResponseValidity: function(response) {

        if(response.length %2 == 0 && response.length >= 10) {

            var head = response.substr(0, 8);
            var tail = response.substr(tail.length - 3, 2);

            console.log("head: " + head + " tail: " + tail );
        }
        return true;
    }

};