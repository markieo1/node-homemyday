import * as mongoose from 'mongoose';
import mochaAsync from '../src/utils/mocha.async';
const MongoInMemory = require('mongo-in-memory');

const port = 8000;
const mongoServerInstance = new MongoInMemory(port);

before(mochaAsync(async () => {
    await mongoServerInstance.start();

    const mongouri = mongoServerInstance.getMongouri('homemyday_test');

    try {
    await mongoose.connect(mongouri, {
        useMongoClient: true
    });
    } catch (e) {
        console.log(e);
    }
}));

after(mochaAsync(async () => {
    await mongoose.disconnect();

    mongoServerInstance.stop((error) => {
        if (error) {
            console.error(error);
        }
    });
}));

export { mochaAsync };
