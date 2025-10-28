const { Router } = require ('express');
const router = Router();

const { GetByTherapist } = require('../controllers/index.contreoller')
const { getQuestions } = require('../controllers/index.contreoller')
const { GetByIdTherapist } = require ('../controllers/index.contreoller');
const { postAnswers } = require('../controllers/index.contreoller')
const { CreateAccounts } = require('../controllers/index.contreoller')
const { SingIn } = require('../controllers/index.contreoller')
const { Applications } = require('../controllers/index.contreoller')
const { createConversation } =  require('../controllers/index.contreoller')
const { getConversationsByUserId } =  require('../controllers/index.contreoller')
const { sendMessage } =  require('../controllers/index.contreoller')
const { getMessagesByConversationId } =  require('../controllers/index.contreoller')
const { GetByIdUser } =  require('../controllers/index.contreoller')





router.get('/getQuestions', getQuestions);
router.get('/getTherapist', GetByTherapist );
router.get('/getTherapist/:id', GetByIdTherapist );
router.get('/GetByIdUser/:id', GetByIdUser);
router.get('/getMessagesByConversationId/:id', getMessagesByConversationId);

router.post('/createConversation', createConversation )
router.post('/getConversationsByUserId', getConversationsByUserId )
router.post('/sendMessage', sendMessage )
router.post('/getApplications', Applications);
router.post('/postQuestions', postAnswers);
router.post('/CreateUsers', CreateAccounts);
router.post('/SingIn', SingIn);

module.exports =  router;