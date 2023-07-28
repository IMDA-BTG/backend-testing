import { Client } from 'redis-om'
import { createClient } from 'redis'
import { test, expect } from '@playwright/test'
import dotenv from 'dotenv';

const URI = 'redis://127.0.0.1:6379'
const connection = createClient({ URI })

let task, validateDataset, validateModel, baseDir = process.env.BASEDIR

test.describe.configure({ mode: 'serial' });

test.describe('Test Engine Task', () => {

    test('Test Engine Task with Valid Inputs (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "task:642691211b68cd044de3001e-642691211b68cd044de30023",
            "algorithmId": "algo:aiverify.stock.partial_dependence_plot:partial_dependence_plot",
            "algorithmArgs": {},
            "testDataset": baseDir + "/uploads/data/pickle_pandas_tabular_loan_testing.sav",
            "modelFile": baseDir + "/uploads/model/pickle_scikit_multiclasslr_loan.sav",
            "groundTruthDataset": baseDir + "/uploads/data/pickle_pandas_tabular_loan_testing.sav",
            "modelType":"classification",
            "groundTruth":"Interest_Rate"
        })

        // Create Connection to App via Redis
        await connection.connect()

        // Open API Connection to App via Redis
        const client = await new Client().use(connection)

        // Send Task to Task Listener in App via Redis Stream
        const eventId = await connection.xAdd('TestEngineTask', '*', { task })

        // App returns HSET response via Redis Stream
        const output = await connection.xRange('TestEngineTask', eventId, eventId)

        // Parse HSET Response
        const taskId = JSON.parse(output[0].message.task).id

        // Get HSET Response
        let taskResponse = await connection.hGetAll(taskId)

        while (taskResponse.status != 'Success') {
            taskResponse = await connection.hGetAll(taskId)
        }

        // Assert Response
        expect(taskResponse.status).toBe('Success')

        // Close API Connection
        await client.close()

    });

    test('Invalid Data File (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "task:642691211b68cd044de3001e-642691211b68cd044de30024",
            "algorithmId": "algo:aiverify.stock.algorithms.partial_dependence_plot:partial_dependence_plot",
            "algorithmArgs": { "percentiles": [0.05, 0.95], "target_feature_name": "Interest_Rate", "grid_resolution": 100 },
            "testDataset": baseDir + "/backend-testing/uploads/data/combine_all.sh",
            "modelFile": baseDir + "/backend-testing/uploads/model/pickle_scikit_multiclasslr_loan.sav",
            "groundTruthDataset": baseDir + "/uploads/data/pickle_pandas_tabular_loan_testing.sav",
            "modelType": "classification",
            "groundTruth": "Interest_Rate"
        })    

        // Create Connection to App via Redis
        await connection.connect()

        // Open API Connection to App via Redis
        const client = await new Client().use(connection)

        // Send Task to Task Listener in App via Redis Stream
        const eventId = await connection.xAdd('TestEngineTask', '*', { task })

        // App returns HSET response via Redis Stream
        const output = await connection.xRange('TestEngineTask', eventId, eventId)

        // Parse HSET Response
        const taskId = JSON.parse(output[0].message.task).id

        // Get HSET Response
        let taskResponse = await connection.hGetAll(taskId)

        // Assert Response
        // expect(taskResponse.status).toBe('Success')

        // Close API Connection
        await client.close()

    })

    test('Invalid Model File (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "task:642691211b68cd044de3001e-642691211b68cd044de30025",
            "algorithmId": "algo:aiverify.stock.algorithms.partial_dependence_plot:partial_dependence_plot",
            "algorithmArgs": { "percentiles": [0.05, 0.95], "target_feature_name": "Interest_Rate", "grid_resolution": 100 },
            "testDataset": baseDir + "/backend-testing/uploads/data/pickle_pandas_tabular_loan_testing.sav",
            "modelFile": baseDir + "/backend-testing/uploads/data/combine_all.sh",
            "groundTruthDataset": baseDir + "/uploads/data/pickle_pandas_tabular_loan_testing.sav",
            "modelType": "classification",
            "groundTruth": "Interest_Rate"
        })

        // Create Connection to App via Redis
        await connection.connect()

        // Open API Connection to App via Redis
        const client = await new Client().use(connection)

        // Send Task to Task Listener in App via Redis Stream
        const eventId = await connection.xAdd('TestEngineTask', '*', { task })

        // App returns HSET response via Redis Stream
        const output = await connection.xRange('TestEngineTask', eventId, eventId)

        // Parse HSET Response
        const taskId = JSON.parse(output[0].message.task).id

        // Get HSET Response
        let taskResponse = await connection.hGetAll(taskId)

        // Assert Response
        // expect(taskResponse.status).toBe('Success')

        // Close API Connection
        await client.close()

    })

    test('Invalid Input Schema (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "task:642691211b68cd044de3001e-642691211b68cd044de30026",
            "algorithmId": "algo:aiverify.stock.algorithms.fairness_metrics_toolbox:fairness_metrics_toolbox",
            "algorithmArgs": { "sensitive_feature": ["Gender", "Home_Owner"] },
            "testDataset": baseDir + "/backend-testing/uploads/data/pickle_pandas_tabular_loan_testing.sav",
            "modelFile": baseDir + "/backend-testing/uploads/model/combine_all.sh",
            "groundTruthDataset": baseDir + "/backend-testing/pickle_pandas_tabular_loan_testing.sav",
            "modelType": "classification",
            "groundTruth": "Interest_Rate"
        })

        // Create Connection to App via Redis
        await connection.connect()

        // Open API Connection to App via Redis
        const client = await new Client().use(connection)

        // Send Task to Task Listener in App via Redis Stream
        const eventId = await connection.xAdd('TestEngineTask', '*', { task })

        // App returns HSET response via Redis Stream
        const output = await connection.xRange('TestEngineTask', eventId, eventId)

        // Parse HSET Response
        const taskId = JSON.parse(output[0].message.task).id

        // Get HSET Response
        let taskResponse = await connection.hGetAll(taskId)

        // Assert Response
        // expect(taskResponse.status).toBe('Success')

        // Close API Connection
        await client.close()

    })

    test('Invalid Algorithm ID (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "task:642691211b68cd044de3001e-642691211b68cd044de30027",
            "algorithmId": "aiverify.algorithms.partial_dependence_plot:partial_dependence_plot",
            "algorithmArgs": { "percentiles": [0.05, 0.95], "target_feature_name": "Interest_Rate", "grid_resolution": 100 },
            "testDataset": baseDir + "/backend-testing/uploads/data/pickle_pandas_tabular_loan_testing.sav",
            "modelFile": baseDir + "/backend-testing/uploads/model/pickle_scikit_multiclasslr_loan.sav",
            "modelType": "classification",
            "groundTruth": "Interest_Rate"
        })

        // Create Connection to App via Redis
        await connection.connect()

        // Open API Connection to App via Redis
        const client = await new Client().use(connection)

        // Send Task to Task Listener in App via Redis Stream
        const eventId = await connection.xAdd('TestEngineTask', '*', { task })

        // App returns HSET response via Redis Stream
        const output = await connection.xRange('TestEngineTask', eventId, eventId)

        // Parse HSET Response
        const taskId = JSON.parse(output[0].message.task).id

        // Get HSET Response
        let taskResponse = await connection.hGetAll(taskId)

        // Assert Response
        // expect(taskResponse.status).toBe('Success')

        // Close API Connection
        await client.close()

    })

})

test.skip('Test Engine Service', () => {

    test('Validate Dataset', async () => {

        validateDataset = JSON.stringify({
            "serviceId": "service:64530",
            "filePath": baseDir + "/backend-testing/uploads/data/pickle_pandas_tabular_loan_testing.sav"
        })

        // Create Connection to App via Redis
        await connection.connect()

        const client = await new Client().use(connection)

        // Send Task to Task Listener in App via Redis Stream
        const eventId = await connection.xAdd('TestEngineService', '*', { validateDataset })

        // App returns HSET response via Redis Stream
        const output = await connection.xRange('TestEngineService', eventId, eventId)

        // Parse HSET Response
        const serviceId = JSON.parse(output[0].message.validateDataset).serviceId

        // Get HSET Response
        const serviceResponse = await connection.hGetAll(serviceId)

        // Assert Response
        expect(serviceResponse.validationResult).toBe('valid')

        // Close API Connection
        await client.close()
    })

    test.skip('Invalid Dataset', async () => {

        validateDataset = JSON.stringify({
            "serviceId": "service:64531",
            "filePath": baseDir + "/backend-testing/uploads/data/combine_all.sh"
        })

        // Create Connection to App via Redis
        await connection.connect()

        const client = await new Client().use(connection)

        // Send Task to Task Listener in App via Redis Stream
        const eventId = await connection.xAdd('TestEngineService', '*', { validateDataset })

        // App returns HSET response via Redis Stream
        const output = await connection.xRange('TestEngineService', eventId, eventId)

        // Parse HSET Response
        const serviceId = JSON.parse(output[0].message.validateDataset).serviceId

        // Get HSET Response
        const serviceResponse = await connection.hGetAll(serviceId)

        // Assert Response
        expect(serviceResponse.validationResult).toBe('invalid')

        // Close API Connection
        await client.close()

    })

    test.skip('Validate Model', async () => {

        validateModel = JSON.stringify({
            "serviceId": "service:64530a39dc46da5656d1593k",
            "mode": "upload",
            "filePath": baseDir + "/backend-testing/uploads/model/pickle_scikit_multiclasslr_loan.sav"
        })

        // Create Connection to App via Redis
        await connection.connect()

        const client = await new Client().use(connection)

        // Send Task to Task Listener in App via Redis Stream
        const eventId = await connection.xAdd('TestEngineService', '*', { validateModel })

        // App returns HSET response via Redis Stream
        const output = await connection.xRange('TestEngineService', eventId, eventId)

        // Parse HSET Response
        const serviceId = JSON.parse(output[0].message.validateModel).serviceId

        // Get HSET Response
        const serviceResponse = await connection.hGetAll(serviceId)

        // Assert Response
        expect(serviceResponse.validationResult).toBe('valid')

        // Close API Connection
        await client.close()
    })

    test.skip('Invalid Model', async () => {

    })

})