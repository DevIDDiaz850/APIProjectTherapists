const pg = require('pg');
const bcrypt = require('bcrypt'); // Asegúrate de tener bcrypt instalado y requerido

const pool = new pg.Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'resistol850',
    database: 'listentome',
    port: '5432'
});

const getQuestions = async (req, res) => {
    const response = await pool.query('SELECT * FROM preguntas');
    res.json(response.rows);
    console.log("Consulta de preguntas realizada correctamente");
};

const postAnswers = async (req, res) => {
    const { question_id, answer } = req.body;

    if (!question_id || !answer) {
        return res.status(400).json({ error: 'question_id y answer son requeridos' });
    }

    try {
        const response = await pool.query(
            'INSERT INTO respuestas (question_id, answer) VALUES ($1, $2) RETURNING *',
            [question_id, answer]
        );

        res.json(response.rows[0]);
        console.log("Inserción de respuesta realizada correctamente");
    } catch (error) {
        console.error("Error al insertar la respuesta:", error);
        res.status(500).json({ error: 'Error al insertar la respuesta' });
    }
};

const CreateAccounts = async (req, res) => {
    const { nombre, email, contrasena, tipo_usuario } = req.body;

    if (!nombre || !email || !contrasena || !tipo_usuario) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    try {
        // Verificar si el usuario ya existe
        const userExists = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contrasena, salt);

        // Insertar el nuevo usuario en la base de datos
        const response = await pool.query(
            "INSERT INTO usuarios (nombre, email, contrasena, tipo_usuario) VALUES ($1, $2, $3, $4) RETURNING *",
            [nombre, email, hashedPassword, tipo_usuario]
        );

        res.json(response.rows[0]);
        console.log("Inserción de cuenta realizada correctamente");
    } catch (error) {
        console.error("Error al insertar la cuenta:", error);
        res.status(500).json({ error: 'Error al insertar la cuenta' });
    }
};


const SingIn = async (req, res) => {
    const { email, contrasena, tipo_usuario, verificado } = req.body;
    if (!email || !contrasena) {
        return res.status(400).json({ error: 'Los campos son requeridos' });
    }
    try {
        const user = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }
        const validPassword = await bcrypt.compare(contrasena, user.rows[0].contrasena);
        if (!validPassword) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }
        const typeUser = await pool.query("SELECT * FROM usuarios WHERE email = $1 AND tipo_usuario = $2 AND verificado = $3", [email, tipo_usuario, verificado]);
        if (!typeUser) {
            return res.status(200).json({ message: 'Usuario no verificado', user: user.rows[0] });
        }
        res.json({ message: 'Inicio de sesión exitoso', user: user.rows[0] });
        console.log("Inicio de sesión realizado correctamente");
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

const SingInWeb = async (req, res) => {
    const { email, contrasena, tipo_usuario, verificado } = req.body;
    if (!email || !contrasena) {
        return res.status(400).json({ error: 'Los campos son requeridos' });
    }
    try {
        const user = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }
        const validPassword = await bcrypt.compare(contrasena, user.rows[0].contrasena);
        if (!validPassword) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }
        const typeUser = await pool.query("SELECT * FROM usuarios WHERE email = $1 AND tipo_usuario = $2 AND verificado = $3", [email, tipo_usuario, verificado]);
        if (!typeUser) {
            return res.status(200).json({ message: 'Usuario no verificado', user: user.rows[0] });
        }

        res.json({ message: 'Inicio de sesión exitoso', user: user.rows[0] });
        console.log("Inicio de sesión realizado correctamente");
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

//GET FROM USERS PSICOLOGOS
const GetByTherapist = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM usuarios WHERE tipo_usuario = 'psicologo' AND verificado = 'true'");
        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No hay datos" });
        }
        res.json(result.rows);
        console.log("Consulta de terapeutas realizada correctamente");
    } catch (error) {
        console.error("El error es:", error);
        res.status(500).json({ error: "Error al buscar terapeutas" });
    }
};

//GET BY ID FROM USERS PSICOLOGOS
const GetByIdTherapist = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE id = $1 AND tipo_usuario = $2', [id, 'psicologo']);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Terapista no encontrado" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener los detalles del terapista:', error);
        res.status(500).json({ error: 'Error al obtener los detalles del terapista' });
    }
};

//GET BY ID FROM USERS PSICOLOGOS
const GetByIdUser = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id,]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "usuario no encontrado" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener los detalles del terapista:', error);
        res.status(500).json({ error: 'Error al obtener los detalles del terapista' });
    }
};




//GET USERS APPLICATION
const Applications = async (req, res) => {
    const { idUser, therapistId } = req.body;
    try {
        const ApplicationsP = await pool.query(
            'SELECT * FROM admissions WHERE usuario_id = $1 AND idpsicologo = $2 AND aprobada = $3',
            [idUser, therapistId, true]  
        );
        if (ApplicationsP.rowCount === 0) {
            return res.status(200).json({ error: 'aun no hay solicitudes' });
        }
        res.status(200).json(ApplicationsP.rows);
    } catch (error) {
        console.error('Error al obtener los detalles de solicitud:', error);
        res.status(500).json({ error: 'Error al obtener los detalles del terapeuta' });
    }
};
//create conversation
const createConversation = async (req, res) => {
    const { userId1, userId2 } = req.body;

    const userId1Int = parseInt(userId1, 10);
    const userId2Int = parseInt(userId2, 10);

    try {
        await pool.query('BEGIN');

        const existingConversation = await pool.query(
            `SELECT c.id
             FROM conversations c
             JOIN participants p1 ON c.id = p1.conversation_id
             JOIN participants p2 ON c.id = p2.conversation_id
             WHERE p1.user_id = $1 AND p2.user_id = $2`,
            [userId1Int, userId2Int]
        );

        if (existingConversation.rows.length > 0) {
            await pool.query('COMMIT');
            return res.status(200).json({ conversationId: existingConversation.rows[0].id });
        }

        const result = await pool.query(
            'INSERT INTO conversations (created_at) VALUES (CURRENT_TIMESTAMP) RETURNING id'
        );
        const conversationId = result.rows[0].id;

        await pool.query(
            'INSERT INTO participants (conversation_id, user_id, joined_at) VALUES ($1, $2, CURRENT_TIMESTAMP), ($1, $3, CURRENT_TIMESTAMP)',
            [conversationId, userId1Int, userId2Int]
        );

        await pool.query('COMMIT');

        res.status(201).json({ conversationId });
    } catch (error) {
        console.error('Error creating conversation:', error);
        await pool.query('ROLLBACK');
        res.status(500).json({ error: 'Error creating conversation' });
    }
};

const getConversationsByUserId = async (req, res) => {
    const { id_usuario } = req.body;
    
    const idUsuarioInt = parseInt(id_usuario, 10);

    try {
        const query = `
            SELECT c.id AS conversation_id, c.created_at, c.last_message, c.last_message_at, 
                   u1.nombre AS user_name_1, u2.nombre AS user_name_2
            FROM conversations c
            JOIN participants p1 ON c.id = p1.conversation_id
            JOIN participants p2 ON c.id = p2.conversation_id
            JOIN usuarios u1 ON p1.user_id = u1.id
            JOIN usuarios u2 ON p2.user_id = u2.id
            WHERE p1.user_id = $1 AND p1.user_id != p2.user_id
            ORDER BY c.last_message_at ASC
        `;

        const { rows } = await pool.query(query, [idUsuarioInt]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ error: 'Error fetching conversations' });
    }
};






const sendMessage = async (req, res) => {
    const { conversation_id, sender_id, content } = req.body;

    const conversationId = parseInt(conversation_id, 10);
    const senderId = parseInt(sender_id, 10);

    try {
        const result = await pool.query(
            'INSERT INTO messages (conversation_id, sender_id, content, created_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING id',
            [conversationId, senderId, content]
        );
        await pool.query(
            'UPDATE conversations SET last_message = $1, last_message_at = CURRENT_TIMESTAMP WHERE id = $2',
            [content, conversationId]
        );

        res.status(201).json({ messageId: result.rows[0].id });
    } catch (error) {
        console.error('Error adding message:', error);
        res.status(500).json({ error: 'Error adding message' });
    }
};

//get messages i conversation id
const getMessagesByConversationId = async (req, res) => {
    const { id: conversationId } = req.params;

    try {
        console.log(`Fetching messages for conversation ID: ${conversationId}`);
        
        const result = await pool.query(
            `SELECT m.id, m.sender_id, m.content, m.created_at, m.is_read
             FROM messages m
             WHERE m.conversation_id = $1
             ORDER BY m.created_at DESC`,
            [conversationId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Error fetching messages' });
    }
};





module.exports = {
    getQuestions,
    postAnswers,
    CreateAccounts,
    SingIn,
    GetByIdTherapist,
    GetByTherapist,
    Applications,
    createConversation,
    getConversationsByUserId,
    sendMessage,
    GetByIdUser,
    SingInWeb,
    getMessagesByConversationId,
};

