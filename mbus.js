

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

    checkResponseValidity: function(response) {

        if ((response.length%2 === 0) && (response.length >= 12)) {

            console.log("valid length");

            var head = response.substr(0, 8);
            var tail = response.substr(response.length - 2, 2);

            if ((head.substr(0,2) === "68") && (head.substr(6,2) === "68") && (tail === "16")) {

                console.log("Valid head and tail");

                var body = response.substr(8, response.length - 12);
                var cs = response.substr(response.length - 4, 2);
                var messageLength = response.substr(2, 2);

                if(this.checksum(body) === cs) {
                    console.log("valid checksum");
                }
            }
        }
        return false;
    },



    /*-- Support functions ---*/

    createTelegram: function(telegramBody) {
        var cs = this.checksum(telegramBody);
        return ("10" + telegramBody + cs +"16");
    },

    checksum: function(message) {
        if (message.length%2 === 0) {

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
};