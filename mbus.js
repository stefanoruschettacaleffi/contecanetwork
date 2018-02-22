

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
        return this.createTelegram("40" + primaryAddress);
    },


    /*-- Support functions ---*/

    createTelegram: function(telegramBody) {
        var cs = this.checksum(telegramBody);
        return ("10" + telegramBody + cs +"16");
    },


    checksum: function(message) {
        if(message%2 == 0) {

            var sum = 0;
            for (var c = 0; c < str.length; c += 2) {
                sum += parseInt(str.substr(c, 2), 16);
            }

            var res = (sum % 256).toString(16);

            if (res.length == 1) {
                res = "0" + res;
            }

            return res;
        }
    }
};