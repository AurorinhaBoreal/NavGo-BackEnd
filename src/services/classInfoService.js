import database from '../repository/mySQL.js';

async function createClassInfo(subject_id, period_id, week_day, teacher_id, course_id, location_id) {
    const conn = await database.connect();

    try {
        const sql = `INSERT INTO class_info 
                     (subject_id, period_id, week_day, teacher_id, course_id, location_id) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
        const data = [subject_id, period_id, week_day, teacher_id, course_id, location_id];
        await conn.query(sql, data);
    } catch (error) {
        throw new Error(error.message || 'Erro ao criar informações da aula');
    } finally {
        conn.end();
    }
}

async function listAllClasses() {
    const conn = await database.connect();

    try {
        const sql = 'SELECT * FROM class_info WHERE soft_delete = 0';
        const [rows] = await conn.query(sql);
        if (rows.length === 0) {
            throw new Error('Nenhuma aula encontrada');
        }
        return rows;
    } catch (error) {
        throw new Error('Erro ao listar aulas');
    } finally {
        conn.end();
    }
}

async function listOneClass(class_id) {
    const conn = await database.connect();

    try {
        const sql = 'SELECT * FROM class_info WHERE class_id = ? AND soft_delete = 0';
        const [rows] = await conn.query(sql, [class_id]);
        if (rows.length === 0) {
            throw new Error('Nenhuma aula encontrada');
        }
        return rows[0];
    } catch (error) {
        throw new Error('Erro ao buscar aula');
    } finally {
        conn.end();
    }
}

async function updateClassInfo(class_id, subject_id, period_id, week_day, teacher_id, course_id, location_id) {
    const conn = await database.connect();

    try {
        const sql = `UPDATE class_info 
                     SET subject_id = ?, period_id = ?, week_day = ?, teacher_id = ?, course_id = ?, location_id = ?
                     WHERE class_id = ? AND soft_delete = 0`;
        const data = [subject_id, period_id, week_day, teacher_id, course_id, location_id, class_id];
        await conn.query(sql, data);
    } catch (error) {
        throw new Error('Erro ao atualizar informações da aula');
    } finally {
        conn.end();
    }
}

async function deleteClass(class_id) {
    const conn = await database.connect();

    try {
        const sql = 'UPDATE class_info SET soft_delete = 1 WHERE class_id = ?';
        await conn.query(sql, [class_id]);
    } catch (error) {
        throw new Error('Erro ao excluir aula');
    } finally {
        conn.end();
    }
}

export default { createClassInfo, listAllClasses, listOneClass, updateClassInfo, deleteClass };
