const jwtUtil = require('../utils/jwt');
const riotStatusService = require("../services/riotStatusService");

exports.getStatus = async (req, res) => {
    try {
        // 인가 코드 받기
        const { userName,tag } = req.body;

        if (!userName||!tag) {
            return res.status(400).json({ message: 'userName and tag is required.' });
        }
        const puuid = await riotStatusService.getPuuid(userName,tag);

        const summonId=await riotStatusService.getSummonId(puuid);

        const matchIds=await  riotStatusService.getMatchIds(puuid);

        const summonRank=await riotStatusService.getRankInfo(summonId);

        const matchInfo=await  riotStatusService.getMatchInfo(matchIds,puuid);

        console.log(matchInfo);
        console.log(summonRank);

        res.status(200).json({ matchInfo, summonRank });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'get riot status failed.', error: error.message });
    }
};