import express from 'express';
import periodsService from '../services/periodsService.js';

const routes = express.Router();

routes.get('/', async (req, res) => {
    try {
        const periods = await periodsService.getAllPeriods();

        if (periods.length < 1) {
            return res.status(204).end();
        }

        res.status(200).json(periods);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno ao buscar os períodos.' });
    }
});

routes.get('/:id', async (req, res) => {
    const periodId = parseInt(req.params.id, 10);

    try {
        const period = await periodsService.getPeriod(periodId);

        if (!period) {
            return res.status(404).json({ message: 'Período não encontrado.' });
        }

        res.status(200).json(period);

    } catch (error) {
        res.status(500).json({ message: 'Erro interno ao buscar o período.' });
    }
});


routes.post('/', async (req, res) => {
    const { start_hour, end_hour } = req.body;

    try {
        if (!start_hour || !end_hour) {
            return res.status(400).send({ message: 'Por favor, preencha todos os campos obrigatórios.' });
        }

        const startTime = new Date(`1970-01-01T${start_hour}Z`);
        const endTime = new Date(`1970-01-01T${end_hour}Z`);

        if (startTime >= endTime) {
            return res.status(400).send({ message: 'A hora de início deve ser anterior à hora de fim.' });
        }

        let day_time;
        const morningEnd = new Date('1970-01-01T12:00:00Z');
        const afternoonEnd = new Date('1970-01-01T18:00:00Z');

        if (startTime < morningEnd) {
            day_time = 'Manhã'; 
        } else if (startTime < afternoonEnd) {
            day_time = 'Tarde';  
        } else {
            day_time = 'Noite'; 
        }

        const result = await periodsService.createPeriod(start_hour, end_hour, day_time);

        if (!result.success) {
            return res.status(400).send(result);
        }

        return res.status(201).send({ message: result.message });
    } catch (error) {
        return res.status(500).send({ message: 'Erro interno do servidor.', error: error.message });
    }
});


routes.put('/:id', async (req, res) => {
    const periodId = parseInt(req.params.id, 10);
    const { start_hour, end_hour, day_time } = req.body;

    try {
        if (!start_hour || !end_hour || !day_time) {
            return res.status(400).send({ message: 'Por favor, preencha todos os campos obrigatórios.' });
        }

        if (day_time.length > 20) {
            return res.status(400).send({ message: 'O campo "day_time" não pode ter mais que 20 caracteres.' });
        }

        const result = await periodsService.updatePeriod(periodId, start_hour, end_hour, day_time);

        if (!result.success) {
            return res.status(400).send({ message: result.message });
        }

        res.status(200).send({ message: result.message });
    } catch (error) {
        res.status(500).send({ message: 'Erro interno ao atualizar o período.' });
    }
});

routes.delete('/:id', async (req, res) => {
    const periodId = parseInt(req.params.id, 10);

    try {
        const period = await periodsService.getPeriod(periodId);

        if (!period) {
            return res.status(404).send({ message: 'Período não encontrado' });
        }

        const result = await periodsService.deletePeriod(periodId);

        res.status(200).send({ message: result.message });
    } catch (error) {
        res.status(500).send({ message: 'Erro interno ao remover o período.' });
    }
});

export default routes;
