import express from 'express';
import service from '../services/classInfoService.js';

const routes = express.Router();

routes.post('/', async (req, res) => {
    const { subject_id, period_id, week_day, teacher_id, course_id, location_id } = req.body;

    try {
        if (!subject_id || !period_id || !week_day || !teacher_id || !course_id || !location_id) {
            return res.status(400).send({ message: 'Todos os campos são obrigatórios!' });
        }

        await service.createClassInfo(subject_id, period_id, week_day, teacher_id, course_id, location_id);

        return res.status(201).send({ message: 'Aula e bucket criados com sucesso!' });

    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
});

routes.get('/user/:user_id', async (req, res) =>{

    const { user_id } = req.params;
    try {
        
        const classes = await service.getClassesByStudent(user_id);

        return res.status(201).json(classes)
    } catch (error) {
        return res.status(404).send({ message: error.message } || 'Ainda não há classes para esse usuário');
    }
})

routes.get('/', async (req, res) => {
    try {
        const classes = await service.listAllClasses();
        return res.status(200).send(classes);
    } catch (error) {
        return res.status(404).send({ message: error.message });
    }
});

routes.get('/:class_id', async (req, res) => {
    const { class_id } = req.params;

    try {
        const classInfo = await service.listOneClass(class_id);
        return res.status(200).send(classInfo);
    } catch (error) {
        return res.status(404).send({ message: error.message });
    }
});

routes.put('/:class_id', async (req, res) => {
    const { class_id } = req.params;
    const { subject_id, period_id, week_day, teacher_id, course_id, location_id } = req.body;

    try {
        if (!subject_id || !period_id || !week_day || !teacher_id || !course_id || !location_id) {
            return res.status(400).send({ message: 'Todos os campos são obrigatórios!' });
        }

        await service.updateClassInfo(class_id, subject_id, period_id, week_day, teacher_id, course_id, location_id);
        return res.status(200).send({ message: 'Aula atualizada com sucesso!' });
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
});

routes.delete('/:class_id', async (req, res) => {
    const { class_id } = req.params;

    try {
        await service.deleteClass(class_id);
        return res.status(200).send({ message: 'Aula excluída com sucesso!' });
    } catch (error) {
        return res.status(404).send({ message: error.message });
    }
});

export default routes;
