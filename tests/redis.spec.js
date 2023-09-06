import { Client } from 'redis-om'
import { createClient } from 'redis'
import { test, expect } from '@playwright/test'

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const models = parse(fs.readFileSync(path.join(__dirname, '../uploads/csv/narrowed_down_list._for_support.csv')), {
    columns: true,
    skip_empty_lines: true,
});

const URI = 'redis://127.0.0.1:6379'
const connection = createClient({ URI })

let task, validateDataset, validateModel, baseDir = process.env.BASEDIR

test.describe('Test Engine Task', () => {

    test('Test Engine Task with Valid Inputs (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "642691211b68cd044de3001e-642691211b68cd044de30022",
            "algorithmId": "algo:aiverify.stock.fairness_metrics_toolbox_for_classification:fairness_metrics_toolbox_for_classification",
            "algorithmArgs": {
                "sensitive_feature": ["Gender", "Home_Owner"],
                "annotated_labels_path": "NA",
                "file_name_label": "NA"
            },
            "testDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
            "modelFile": baseDir + "/qa-test/backend-testing/aiverify-test-samples/models/sklearn/1.2.2/multiclass_classification_loan_sklearn.ensemble._bagging.BaggingClassifier.sav",
            "groundTruthDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
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

        while (taskResponse.status != 'Success') {
            taskResponse = await connection.hGetAll(taskId)
            if (taskResponse.status == 'Error')
                break;
        }

        // Assert Response
        expect.soft(taskResponse.status).toBe('Success')

        // Close API Connection
        await client.close()

    })

    test('Test Engine Task with Valid CSV Inputs (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "642691211b68cd044de3001e-642691211b68cd044de30023",
            "algorithmId": "algo:aiverify.stock.fairness_metrics_toolbox_for_classification:fairness_metrics_toolbox_for_classification",
            "algorithmArgs": {
                "sensitive_feature": ["Gender", "Home_Owner"],
                "annotated_labels_path": "NA",
                "file_name_label": "NA"
            },
            "testDataset": baseDir + "/qa-test/backend-testing/uploads/csv/loan_comma.csv",
            "modelFile": baseDir + "/qa-test/backend-testing/aiverify-test-samples/models/sklearn/1.2.2/multiclass_classification_loan_sklearn.ensemble._bagging.BaggingClassifier.sav",
            "groundTruthDataset": baseDir + "/qa-test/backend-testing/uploads/csv/loan_comma.csv",
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

        while (taskResponse.status != 'Success') {
            taskResponse = await connection.hGetAll(taskId)
            if (taskResponse.status == 'Error')
                break;
        }

        // Assert Response
        expect.soft(taskResponse.status).toBe('Success')

        // Close API Connection
        await client.close()

    })

    test('Incompatible Model/Dataset (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "642691211b68cd044de3001e-642691211b68cd044de30024",
            "algorithmId": "algo:aiverify.stock.fairness_metrics_toolbox_for_classification:fairness_metrics_toolbox_for_classification",
            "algorithmArgs": {
                "sensitive_feature": ["Gender", "Home_Owner"],
                "annotated_labels_path": "NA",
                "file_name_label": "NA"
            },
            "testDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_insurance_testing.sav",
            "modelFile": baseDir + "/qa-test/backend-testing/aiverify-test-samples/models/sklearn/1.2.2/multiclass_classification_loan_sklearn.ensemble._bagging.BaggingClassifier.sav",
            "groundTruthDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_insurance_testing.sav",
            "modelType": "regression",
            "groundTruth": "charges"
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
            if (taskResponse.status == 'Error')
                break;
        }

        // Assert Response
        expect.soft(taskResponse.status).toBe('Error')

        // Close API Connection
        await client.close()

    })

    test('Incompatible Model Type (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "642691211b68cd044de3001e-642691211b68cd044de30025",
            "algorithmId": "algo:aiverify.stock.fairness_metrics_toolbox_for_classification:fairness_metrics_toolbox_for_classification",
            "algorithmArgs": {
                "sensitive_feature": ["Gender", "Home_Owner"],
                "annotated_labels_path": "NA",
                "file_name_label": "NA"
            },
            "testDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
            "modelFile": baseDir + "/qa-test/backend-testing/aiverify-test-samples/models/sklearn/1.2.2/multiclass_classification_loan_sklearn.ensemble._bagging.BaggingClassifier.sav",
            "groundTruthDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
            "modelType": "regression",
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

        while (taskResponse.status != 'Success') {
            taskResponse = await connection.hGetAll(taskId)
            if (taskResponse.status == 'Error')
                break;
        }

        // Assert Response
        expect.soft(taskResponse.status).toBe('Error')

        // Close API Connection
        await client.close()

    })

    test('Incompatible Model/Ground Truth (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "642691211b68cd044de3001e-642691211b68cd044de30026",
            "algorithmId": "algo:aiverify.stock.fairness_metrics_toolbox_for_classification:fairness_metrics_toolbox_for_classification",
            "algorithmArgs": {
                "sensitive_feature": ["Gender", "Home_Owner"],
                "annotated_labels_path": "NA",
                "file_name_label": "NA"
            },
            "testDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
            "modelFile": baseDir + "/qa-test/backend-testing/aiverify-test-samples/models/sklearn/1.2.2/multiclass_classification_loan_sklearn.ensemble._bagging.BaggingClassifier.sav",
            "groundTruthDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_insurance_testing.sav",
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

        while (taskResponse.status != 'Success') {
            taskResponse = await connection.hGetAll(taskId)
            if (taskResponse.status == 'Error')
                break;
        }

        // Assert Response
        expect.soft(taskResponse.status).toBe('Error')

        // Close API Connection
        await client.close()

    })


    test('Incompatible Algorithm (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "642691211b68cd044de3001e-642691211b68cd044de30027",
            "algorithmId": "algo:aiverify.stock.fairness_metrics_toolbox_for_regression:fairness_metrics_toolbox_for_regression",
            "algorithmArgs": {
                "sensitive_feature": ["Gender", "Home_Owner"],
                "annotated_labels_path": "NA",
                "file_name_label": "NA"
            },
            "testDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
            "modelFile": baseDir + "/qa-test/backend-testing/aiverify-test-samples/models/sklearn/1.2.2/multiclass_classification_loan_sklearn.ensemble._bagging.BaggingClassifier.sav",
            "groundTruthDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
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

        while (taskResponse.status != 'Success') {
            taskResponse = await connection.hGetAll(taskId)
            if (taskResponse.status == 'Error')
                break;
        }

        // Assert Response
        expect.soft(taskResponse.status).toBe('Error')

        // Close API Connection
        await client.close()

    })

    test('Missing ID (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "",
            "algorithmId": "algo:aiverify.stock.fairness_metrics_toolbox_for_classification:fairness_metrics_toolbox_for_classification",
            "algorithmArgs": {
                "sensitive_feature": ["Gender", "Home_Owner"],
                "annotated_labels_path": "NA",
                "file_name_label": "NA"
            },
            "testDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
            "modelFile": baseDir + "/qa-test/backend-testing/aiverify-test-samples/models/sklearn/1.2.2/multiclass_classification_loan_sklearn.ensemble._bagging.BaggingClassifier.sav",
            "groundTruthDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
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

        // Close API Connection
        await client.close()

    })

    test('Missing Algorithm ID (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "642691211b68cd044de3001e-642691211b68cd044de30029",
            "algorithmId": "",
            "algorithmArgs": {
                "sensitive_feature": ["Gender", "Home_Owner"],
                "annotated_labels_path": "NA",
                "file_name_label": "NA"
            },
            "testDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
            "modelFile": baseDir + "/qa-test/backend-testing/aiverify-test-samples/models/sklearn/1.2.2/multiclass_classification_loan_sklearn.ensemble._bagging.BaggingClassifier.sav",
            "groundTruthDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
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

        while (taskResponse.status != 'Success') {
            taskResponse = await connection.hGetAll(taskId)
            if (taskResponse.status == 'Error')
                break;
        }

        // Assert Response
        expect.soft(taskResponse.status).toBe('Error')

        // Close API Connection
        await client.close()

    })

    test('Missing Test Arguments (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "642691211b68cd044de3001e-642691211b68cd044de30030",
            "algorithmId": "",
            "algorithmArgs": { "sensitive_feature": ["Gender", "Home_Owner"] },
            "testDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
            "modelFile": baseDir + "/qa-test/backend-testing/aiverify-test-samples/models/sklearn/1.2.2/multiclass_classification_loan_sklearn.ensemble._bagging.BaggingClassifier.sav",
            "groundTruthDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
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

        while (taskResponse.status != 'Success') {
            taskResponse = await connection.hGetAll(taskId)
            if (taskResponse.status == 'Error')
                break;
        }

        // Assert Response
        expect.soft(taskResponse.status).toBe('Error')

        // Close API Connection
        await client.close()

    })

    test('Missing Dataset (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "642691211b68cd044de3001e-642691211b68cd044de30031",
            "algorithmId": "algo:aiverify.stock.fairness_metrics_toolbox_for_classification:fairness_metrics_toolbox_for_classification",
            "algorithmArgs": {
                "sensitive_feature": ["Gender", "Home_Owner"],
                "annotated_labels_path": "NA",
                "file_name_label": "NA"
            },
            "testDataset": "",
            "modelFile": baseDir + "/qa-test/backend-testing/aiverify-test-samples/models/sklearn/1.2.2/multiclass_classification_loan_sklearn.ensemble._bagging.BaggingClassifier.sav",
            "groundTruthDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
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

        while (taskResponse.status != 'Success') {
            taskResponse = await connection.hGetAll(taskId)
            if (taskResponse.status == 'Error')
                break;
        }

        // Assert Response
        expect.soft(taskResponse.status).toBe('Error')

        // Close API Connection
        await client.close()

    })

    test('Missing Model File (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "642691211b68cd044de3001e-642691211b68cd044de30032",
            "algorithmId": "algo:aiverify.stock.fairness_metrics_toolbox_for_classification:fairness_metrics_toolbox_for_classification",
            "algorithmArgs": {
                "sensitive_feature": ["Gender", "Home_Owner"],
                "annotated_labels_path": "NA",
                "file_name_label": "NA"
            },
            "testDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
            "modelFile": "",
            "groundTruthDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
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

        while (taskResponse.status != 'Success') {
            taskResponse = await connection.hGetAll(taskId)
            if (taskResponse.status == 'Error')
                break;
        }

        // Assert Response
        expect.soft(taskResponse.status).toBe('Error')

        // Close API Connection
        await client.close()

    })

    test('Missing Ground Truth Dataset (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "642691211b68cd044de3001e-642691211b68cd044de30033",
            "algorithmId": "algo:aiverify.stock.fairness_metrics_toolbox_for_classification:fairness_metrics_toolbox_for_classification",
            "algorithmArgs": {
                "sensitive_feature": ["Gender", "Home_Owner"],
                "annotated_labels_path": "NA",
                "file_name_label": "NA"
            },
            "testDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
            "modelFile": baseDir + "/qa-test/backend-testing/aiverify-test-samples/models/sklearn/1.2.2/multiclass_classification_loan_sklearn.ensemble._bagging.BaggingClassifier.sav",
            "groundTruthDataset": "",
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

        while (taskResponse.status != 'Success') {
            taskResponse = await connection.hGetAll(taskId)
            if (taskResponse.status == 'Error')
                break;
        }

        // Assert Response
        expect.soft(taskResponse.status).toBe('Error')

        // Close API Connection
        await client.close()

    })

    test('Missing Model Type (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "642691211b68cd044de3001e-642691211b68cd044de30034",
            "algorithmId": "algo:aiverify.stock.fairness_metrics_toolbox_for_classification:fairness_metrics_toolbox_for_classification",
            "algorithmArgs": {
                "sensitive_feature": ["Gender", "Home_Owner"],
                "annotated_labels_path": "NA",
                "file_name_label": "NA"
            },
            "testDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
            "modelFile": baseDir + "/qa-test/backend-testing/aiverify-test-samples/models/sklearn/1.2.2/multiclass_classification_loan_sklearn.ensemble._bagging.BaggingClassifier.sav",
            "groundTruthDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
            "modelType": "",
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

        while (taskResponse.status != 'Success') {
            taskResponse = await connection.hGetAll(taskId)
            if (taskResponse.status == 'Error')
                break;
        }

        // Assert Response
        expect.soft(taskResponse.status).toBe('Error')

        // Close API Connection
        await client.close()

    })

    test('Missing Ground Truth (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "642691211b68cd044de3001e-642691211b68cd044de30035",
            "algorithmId": "algo:aiverify.stock.fairness_metrics_toolbox_for_classification:fairness_metrics_toolbox_for_classification",
            "algorithmArgs": {
                "sensitive_feature": ["Gender", "Home_Owner"],
                "annotated_labels_path": "NA",
                "file_name_label": "NA"
            },
            "testDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
            "modelFile": baseDir + "/qa-test/backend-testing/aiverify-test-samples/models/sklearn/1.2.2/multiclass_classification_loan_sklearn.ensemble._bagging.BaggingClassifier.sav",
            "groundTruthDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
            "modelType": "classification",
            "groundTruth": ""
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
            if (taskResponse.status == 'Error')
                break;
        }

        // Assert Response
        expect.soft(taskResponse.status).toBe('Error')

        // Close API Connection
        await client.close()

    })

    test('Invalid Mode (Upload)', async () => {

        task = JSON.stringify({
            "mode": "test",
            "id": "642691211b68cd044de3001e-642691211b68cd044de30036",
            "algorithmId": "algo:aiverify.stock.fairness_metrics_toolbox_for_classification:fairness_metrics_toolbox_for_classification",
            "algorithmArgs": {
                "sensitive_feature": ["Gender", "Home_Owner"],
                "annotated_labels_path": "NA",
                "file_name_label": "NA"
            },
            "testDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
            "modelFile": baseDir + "/qa-test/backend-testing/aiverify-test-samples/models/sklearn/1.2.2/multiclass_classification_loan_sklearn.ensemble._bagging.BaggingClassifier.sav",
            "groundTruthDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
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

        while (taskResponse.status != 'Success') {
            taskResponse = await connection.hGetAll(taskId)
            if (taskResponse.status == 'Error')
                break;
        }

        // Assert Response
        expect.soft(taskResponse.status).toBe('Error')

        // Close API Connection
        await client.close()

    })

    test('Invalid Algorithm ID (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "642691211b68cd044de3001e-642691211b68cd044de30037",
            "algorithmId": "aiverify.stock.fairness_metrics_toolbox_for_classification:fairness_metrics_toolbox_for_classification",
            "algorithmArgs": {
                "sensitive_feature": ["Gender", "Home_Owner"],
                "annotated_labels_path": "NA",
                "file_name_label": "NA"
            },
            "testDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
            "modelFile": baseDir + "/qa-test/backend-testing/aiverify-test-samples/models/sklearn/1.2.2/multiclass_classification_loan_sklearn.ensemble._bagging.BaggingClassifier.sav",
            "groundTruthDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
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

        while (taskResponse.status != 'Success') {
            taskResponse = await connection.hGetAll(taskId)
            if (taskResponse.status == 'Error')
                break;
        }

        // Assert Response
        expect.soft(taskResponse.status).toBe('Error')

        // Close API Connection
        await client.close()

    })

    test('Invalid Test Arguments (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "642691211b68cd044de3001e-642691211b68cd044de30038",
            "algorithmId": "algo:aiverify.stock.fairness_metrics_toolbox_for_classification:fairness_metrics_toolbox_for_classification",
            "algorithmArgs": { "annotated_ground_truth_path": "/path", "file_name_label": "file_name" },
            "testDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
            "modelFile": baseDir + "/qa-test/backend-testing/aiverify-test-samples/models/sklearn/1.2.2/multiclass_classification_loan_sklearn.ensemble._bagging.BaggingClassifier.sav",
            "groundTruthDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
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

        while (taskResponse.status != 'Success') {
            taskResponse = await connection.hGetAll(taskId)
            if (taskResponse.status == 'Error')
                break;
        }

        // Assert Response
        expect.soft(taskResponse.status).toBe('Error')

        // Close API Connection
        await client.close()

    })

    test('Invalid Dataset (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "642691211b68cd044de3001e-642691211b68cd044de30039",
            "algorithmId": "algo:aiverify.stock.fairness_metrics_toolbox_for_classification:fairness_metrics_toolbox_for_classification",
            "algorithmArgs": {
                "sensitive_feature": ["Gender", "Home_Owner"],
                "annotated_labels_path": "NA",
                "file_name_label": "NA"
            },
            "testDataset": baseDir + "/qa-test/backend-testing/uploads/data/combine_all.sh",
            "modelFile": baseDir + "/qa-test/backend-testing/aiverify-test-samples/models/sklearn/1.2.2/multiclass_classification_loan_sklearn.ensemble._bagging.BaggingClassifier.sav",
            "groundTruthDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
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

        while (taskResponse.status != 'Success') {
            taskResponse = await connection.hGetAll(taskId)
            if (taskResponse.status == 'Error')
                break;
        }

        // Assert Response
        expect(taskResponse.status).toBe('Error')

        // Close API Connection
        await client.close()

    })

    test('Invalid Model File (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "642691211b68cd044de3001e-642691211b68cd044de30040",
            "algorithmId": "algo:aiverify.stock.fairness_metrics_toolbox_for_classification:fairness_metrics_toolbox_for_classification",
            "algorithmArgs": {
                "sensitive_feature": ["Gender", "Home_Owner"],
                "annotated_labels_path": "NA",
                "file_name_label": "NA"
            },
            "testDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
            "modelFile": baseDir + "/qa-test/backend-testing/uploads/data/combine_all.sh",
            "groundTruthDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
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

        while (taskResponse.status != 'Success') {
            taskResponse = await connection.hGetAll(taskId)
            if (taskResponse.status == 'Error')
                break;
        }

        // Assert Response
        expect.soft(taskResponse.status).toBe('Error')

        // Close API Connection
        await client.close()

    })

    test('Invalid Ground Truth Dataset (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "642691211b68cd044de3001e-642691211b68cd044de30041",
            "algorithmId": "algo:aiverify.stock.fairness_metrics_toolbox_for_classification:fairness_metrics_toolbox_for_classification",
            "algorithmArgs": {
                "sensitive_feature": ["Gender", "Home_Owner"],
                "annotated_labels_path": "NA",
                "file_name_label": "NA"
            },
            "testDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
            "modelFile": baseDir + "/qa-test/backend-testing/aiverify-test-samples/models/sklearn/1.2.2/multiclass_classification_loan_sklearn.ensemble._bagging.BaggingClassifier.sav",
            "groundTruthDataset": baseDir + "/qa-test/backend-testing/uploads/data/combine_all.sh",
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

        while (taskResponse.status != 'Success') {
            taskResponse = await connection.hGetAll(taskId)
            if (taskResponse.status == 'Error')
                break;
        }

        // Assert Response
        expect.soft(taskResponse.status).toBe('Error')

        // Close API Connection
        await client.close()

    })

    test('Invalid Model Type (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "642691211b68cd044de3001e-642691211b68cd044de30042",
            "algorithmId": "algo:aiverify.stock.fairness_metrics_toolbox_for_classification:fairness_metrics_toolbox_for_classification",
            "algorithmArgs": {
                "sensitive_feature": ["Gender", "Home_Owner"],
                "annotated_labels_path": "NA",
                "file_name_label": "NA"
            },
            "testDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
            "modelFile": baseDir + "/qa-test/backend-testing/aiverify-test-samples/models/sklearn/1.2.2/multiclass_classification_loan_sklearn.ensemble._bagging.BaggingClassifier.sav",
            "groundTruthDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
            "modelType": "test",
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

        while (taskResponse.status != 'Success') {
            taskResponse = await connection.hGetAll(taskId)
            if (taskResponse.status == 'Error')
                break;
        }

        // Assert Response
        expect.soft(taskResponse.status).toBe('Error')

        // Close API Connection
        await client.close()

    })

    test('Invalid Ground Truth (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "642691211b68cd044de3001e-642691211b68cd044de30043",
            "algorithmId": "algo:aiverify.stock.fairness_metrics_toolbox_for_classification:fairness_metrics_toolbox_for_classification",
            "algorithmArgs": {
                "sensitive_feature": ["Gender", "Home_Owner"],
                "annotated_labels_path": "NA",
                "file_name_label": "NA"
            },
            "testDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
            "modelFile": baseDir + "/qa-test/backend-testing/aiverify-test-samples/models/sklearn/1.2.2/multiclass_classification_loan_sklearn.ensemble._bagging.BaggingClassifier.sav",
            "groundTruthDataset": baseDir + "/qa-test/backend-testing/aiverify-test-samples/data/pickle_pandas_tabular_loan_testing.sav",
            "modelType": "classification",
            "groundTruth": "two_year_recid"
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
            if (taskResponse.status == 'Error')
                break;
        }

        // Assert Response
        expect.soft(taskResponse.status).toBe('Error')

        // Close API Connection
        await client.close()

    });

    test('Single Column (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "642691211b68cd044de3001e-642691211b68cd044de30044",
            "algorithmId": "algo:aiverify.stock.fairness_metrics_toolbox_for_classification:fairness_metrics_toolbox_for_classification",
            "algorithmArgs": {
                "sensitive_feature": ["Gender", "Home_Owner"],
                "annotated_labels_path": "NA",
                "file_name_label": "NA"
            },
            "testDataset": baseDir + "/qa-test/backend-testing/uploads/csv/loan_single_column.csv",
            "modelFile": baseDir + "/qa-test/backend-testing/aiverify-test-samples/models/sklearn/1.2.2/multiclass_classification_loan_sklearn.ensemble._bagging.BaggingClassifier.sav",
            "groundTruthDataset": baseDir + "/qa-test/backend-testing/uploads/csv/loan_single_column.csv",
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

        while (taskResponse.status != 'Success') {
            taskResponse = await connection.hGetAll(taskId)
            if (taskResponse.status == 'Error')
                break;
        }

        // Assert Response
        expect.soft(taskResponse.status).toBe('Error')

        // Close API Connection
        await client.close()

    })

    test('Incorrect Number of Columns (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "642691211b68cd044de3001e-642691211b68cd044de30045",
            "algorithmId": "algo:aiverify.stock.fairness_metrics_toolbox_for_classification:fairness_metrics_toolbox_for_classification",
            "algorithmArgs": {
                "sensitive_feature": ["Gender", "Home_Owner"],
                "annotated_labels_path": "NA",
                "file_name_label": "NA"
            },
            "testDataset": baseDir + "/qa-test/backend-testing/uploads/csv/loan_incorrect_column_length.csv",
            "modelFile": baseDir + "/qa-test/backend-testing/aiverify-test-samples/models/sklearn/1.2.2/multiclass_classification_loan_sklearn.ensemble._bagging.BaggingClassifier.sav",
            "groundTruthDataset": baseDir + "/qa-test/backend-testing/uploads/csv/loan_incorrect_column_length.csv",
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

        while (taskResponse.status != 'Success') {
            taskResponse = await connection.hGetAll(taskId)
            if (taskResponse.status == 'Error')
                break;
        }

        // Assert Response
        expect.soft(taskResponse.status).toBe('Error')

        // Close API Connection
        await client.close()

    })

    test('Invalid Delimiter (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "642691211b68cd044de3001e-642691211b68cd044de30046",
            "algorithmId": "algo:aiverify.stock.fairness_metrics_toolbox_for_classification:fairness_metrics_toolbox_for_classification",
            "algorithmArgs": {
                "sensitive_feature": ["Gender", "Home_Owner"],
                "annotated_labels_path": "NA",
                "file_name_label": "NA"
            },
            "testDataset": baseDir + "/qa-test/backend-testing/uploads/csv/loan_invalid_delimiter.csv",
            "modelFile": baseDir + "/qa-test/backend-testing/aiverify-test-samples/models/sklearn/1.2.2/multiclass_classification_loan_sklearn.ensemble._bagging.BaggingClassifier.sav",
            "groundTruthDataset": baseDir + "/qa-test/backend-testing/uploads/csv/loan_invalid_delimiter.csv",
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

        while (taskResponse.status != 'Success') {
            taskResponse = await connection.hGetAll(taskId)
            if (taskResponse.status == 'Error')
                break;
        }

        // Assert Response
        expect.soft(taskResponse.status).toBe('Error')

        // Close API Connection
        await client.close()

    })

    test('Missing Column (Upload)', async () => {

        task = JSON.stringify({
            "mode": "upload",
            "id": "642691211b68cd044de3001e-642691211b68cd044de30046",
            "algorithmId": "algo:aiverify.stock.fairness_metrics_toolbox_for_classification:fairness_metrics_toolbox_for_classification",
            "algorithmArgs": {
                "sensitive_feature": ["Gender", "Home_Owner"],
                "annotated_labels_path": "NA",
                "file_name_label": "NA"
            },
            "testDataset": baseDir + "/qa-test/backend-testing/uploads/csv/loan_missing_column.csv",
            "modelFile": baseDir + "/qa-test/backend-testing/aiverify-test-samples/models/sklearn/1.2.2/multiclass_classification_loan_sklearn.ensemble._bagging.BaggingClassifier.sav",
            "groundTruthDataset": baseDir + "/qa-test/backend-testing/uploads/csv/loan_missing_column.csv",
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

        while (taskResponse.status != 'Success') {
            taskResponse = await connection.hGetAll(taskId)
            if (taskResponse.status == 'Error')
                break;
        }

        // Assert Response
        expect.soft(taskResponse.status).toBe('Error')

        // Close API Connection
        await client.close()

    })

})

test.skip('Test Engine Service', () => {

    test('Validate Dataset', async () => {

        validateDataset = JSON.stringify({
            "serviceId": "service:64530",
            "filePath": baseDir + "/qa-test/backend-testing/uploads/data/pickle_pandas_tabular_loan_testing.sav"
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
        expect.soft(serviceResponse.validationResult).toBe('valid')

        // Close API Connection
        await client.close()
    })

    test.skip('Invalid Dataset', async () => {

        validateDataset = JSON.stringify({
            "serviceId": "service:64531",
            "filePath": baseDir + "/qa-test/backend-testing/uploads/data/combine_all.sh"
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
        expect.soft(serviceResponse.validationResult).toBe('invalid')

        // Close API Connection
        await client.close()

    })

    test.skip('Validate Model', async () => {

        validateModel = JSON.stringify({
            "serviceId": "service:64530a39dc46da5656d1593k",
            "mode": "upload",
            "filePath": baseDir + "/qa-test/backend-testing/uploads/model/pickle_scikit_multiclasslr_loan.sav"
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
        expect.soft(serviceResponse.validationResult).toBe('valid')

        // Close API Connection
        await client.close()
    })

})

test.describe('Supported Models', () => {

    for (const model of models) {
        const features = model.algorithmArgs
        const featureType = features.split(':')

        test(`${model.id} ${model.modelName} Model`, async () => {

            if (featureType[0] == 'sensitive_feature') {

                let featureArgs = features.split(',')
                let sensitive_feature = featureArgs[0].replace('[', '').replace(']', '').split(':')
                let feature = sensitive_feature[1].split(' ')

                let annotated_labels_path = featureArgs[1].split(':')
                let file_name_label = featureArgs[2].split(':')

                task = JSON.stringify({
                    "mode": model.mode,
                    "id": model.id,
                    "algorithmId": model.algorithmId,
                    "algorithmArgs": {
                        "sensitive_feature": feature.length == 2 ? [feature[0], feature[1]] : [feature[0]],
                        "annotated_labels_path": annotated_labels_path[1],
                        "file_name_label": file_name_label[1]
                    },
                    "testDataset": baseDir + model.testDataset,
                    "modelFile": baseDir + model.modelFile,
                    "groundTruthDataset": baseDir + model.groundTruthDataset,
                    "modelType": model.modelType,
                    "groundTruth": model.groundTruth
                })

                task = task.replaceAll('\\', '')
            }
            else if (featureType[0] == 'explain_type') {

                let featureArgs = features.split(',')

                task = JSON.stringify({
                    "mode": model.mode,
                    "id": model.id,
                    "algorithmId": model.algorithmId,
                    "algorithmArgs":
                    {
                        "explain_type": featureArgs[0].substring(featureArgs[0].indexOf(":") + 1),
                        "background_samples": parseInt(featureArgs[1].substring(featureArgs[1].indexOf(":") + 1)),
                        "data_samples": parseInt(featureArgs[2].substring(featureArgs[2].indexOf(":") + 1)),
                        "background_path": baseDir + featureArgs[3].substring(featureArgs[3].indexOf(":") + 1)
                    },
                    "testDataset": baseDir + model.testDataset,
                    "modelFile": baseDir + model.modelFile,
                    "groundTruthDataset": baseDir + model.groundTruthDataset,
                    "modelType": model.modelType,
                    "groundTruth": model.groundTruth
                })
            }
            else if (featureType[0] == 'annotated_ground_truth_path') {
                let featureArgs = features.split(',')

                task = JSON.stringify({
                    "mode": model.mode,
                    "id": model.id,
                    "algorithmId": model.algorithmId,
                    "algorithmArgs":
                    {
                        "annotated_ground_truth_path": featureArgs[0].substring(featureArgs[0].indexOf(":") + 1),
                        "file_name_label": featureArgs[1].substring(featureArgs[1].indexOf(":") + 1),
                    },
                    "testDataset": baseDir + model.testDataset,
                    "modelFile": baseDir + model.modelFile,
                    "groundTruthDataset": baseDir + model.groundTruthDataset,
                    "modelType": model.modelType,
                    "groundTruth": model.groundTruth
                })
            }

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
                if (taskResponse.status == 'Error')
                    break;
            }

            // Assert Response
            expect.soft(taskResponse.status).toBe('Success')

            // Close API Connection
            await client.close()
        })
    }
})