const errorMessage = require('../utils/errorMessage');
const jwtUtil = require('../utils/jwt');
const chatStore = require('../store/chatStore');
const chats = {};

chats.allChatingRooms = async (req,res) => {
    try {
        let {page, pageSize} = req.query;
        
        let user_id;
        const token = req.headers['authorization'];
        if(token){
            const authorization = jwtUtil.verifyToken(token.split(' ')[1]);
            user_id = authorization.id;
        } 
        const results = await chatStore.allChatingRooms(user_id, page,  pageSize);
        
        if (results.length){
            let news = {};
            
            results.map((result) => {
            result.createdAt = result.created_at;
            delete result.room_id;
            delete result.user_id;
            });
            console.log(results);
            news = results.filter((result, index)=> {
                console.log(result.id)
                return (
                    results.findIndex((result1)=> {
                        return result.id === result1.id
                    }) === index
                )
            })
            console.log(results);
            return res.status(200).json(news);
        } else {
            return errorMessage(res, 404);
        }
    }
     catch (error) {
      return errorMessage(res, 500);
    }
   
};

chats.createChating = async (req, res)=>{
   
    try {
        let {title} = req.body;
        if (!title) return errorMessage(res, 400);
        const token = req.headers['authorization'];
        if(!token) errorMessage(res, 401);
        const authorization = jwtUtil.verifyToken(token.split(' ')[1]);
        let user_id = authorization.id;
        console.log(authorization);
        
        let result = await chatStore.createChatingRoom(user_id, title);
        console.log(result);
        if(result.affectedRows == 1){
            return res.status(201).json({
                "message" : "채팅방이 등록 됐습니다."
            })
        }
    }
    catch(error){
        return errorMessage(res, 500);

    }
}

chats.createMessage = async (req, res)=>{
    try {
        let {content, roomId} = req.body;
        const token = req.headers['authorization'];
        if(!token) errorMessage(res, 401);

        const authorization = jwtUtil.verifyToken(token.split(' ')[1]);
        let user_id = authorization.id;

        if(!content) return errorMessage(res, 400);
        
        let result = await chatStore.createMessage(user_id, content, roomId);
        console.log(result);
        if(result.affectedRows ==1){
            return res.status(201).json({
                "message" : "메시지가 등록 됐습니다."
            })
        } 
    }
    catch(error){
        return errorMessage(res, 500);

    }
    
}

chats.getMessages = async (req, res)=>{
    try{
        let {id} = req.params;
        let roomId = id;
        let {page, pageSize} = req.query;
  
        const token = req.headers['authorization'];
        console.log(id);
        if(!token) errorMessage(res, 401);
        const authorization = jwtUtil.verifyToken(token.split(' ')[1]);
        let user_id = authorization.id;
        console.log(user_id);
        let results = await chatStore.getMessages(user_id, roomId, 1, 1000);
        console.log(results);
        if (results.length){
            results.map((result) => {
            result.createdAt = results.created_at;
            delete result.room_id;
            delete result.user_id;
            });
            return res.status(200).json(results);
        } else{
            errorMessage(res, 404);
        }       
    } catch(error){
        return errorMessage(res, 500)
    }   
}

chats.joinRoom = async (req, res) =>{
    try{
        
        let {roomId} = req.body;
        const token = req.headers['authorization'];

        if(!token) errorMessage(res, 401);
        console.log(token);
        const authorization = jwtUtil.verifyToken(token.split(' ')[1]);
        let user_id = authorization.id;
        if(!user_id) errorMessage(res, 401);
        console.log(authorization);
        let results = await chatStore.joinRoom(user_id, roomId);

        if(results.affectedRows == 1){
            return res.status(201).json({
                "message" : "채팅방에 참여하기가 완료 됐습니다."
            })
        }
    } catch(error){
        return errorMessage(res, 500)
    }   
}

chats.outRoom = async (req, res) => {
    try{
        
        let {id} = req.params;
        const token = req.headers['authorization'];
        console.log(token);

        if(!token) errorMessage(res, 401);
        const authorization = jwtUtil.verifyToken(token.split(' ')[1]);
        
        let user_id = authorization.id;
        let result = await chatStore.outRoom(user_id, id);

        if(result.affectedRows >= 1){
            return res.status(200).json({
                "message" : "채팅방을 성공적으로 나왔습니다."
            })
        }else{
            errorMessage(res, 401);
        }
    } catch(error){
        return errorMessage(res, 500)
    }  
}


module.exports = chats;