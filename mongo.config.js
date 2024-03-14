const mongoose = require('mongoose');
mongoose.set("strictQuery", false);

// connecting to database
(async function main() {    
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB connection established.');
    } catch (err) {
        console.log(err);
    }
})();

module.exports = {
    sync: async () => {
        try{
            switch(mongoose.connection.readyState){
                case 0:
                    console.log("db [mongo] is not available.");
                    break;
                case 1:
                    console.log("db [mongo] synced successfully.");
                    break;
                case 2:
                    console.log("db [mongo] syncing...");
                    break;
                case 4:
                    console.log("db [mongo] de-syncing...");
                    break;
            }
        }catch(err){
            console.log("db [mongo] synced failed: " + err.message);
        }
    }
}
