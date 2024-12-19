const axios = require('axios');
require('dotenv').config();

class RiotStatusService {
    // 공통 axios 요청 함수
    async makeRequest(url) {
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
            'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Origin': 'https://developer.riotgames.com',
            'X-Riot-Token': process.env.RIOT_API,  // .env 파일에서 API 키 읽어오기
        };

        try {
            // API 요청
            const response = await axios.get(url, { headers });
            return response.data;  // 성공적으로 응답 받은 데이터 반환
        } catch (error) {
            console.error('Error with request:', error);
            throw error;  // 에러를 호출한 곳으로 전달
        }
    }

    // 소환사의 PUUID 가져오기
    async getPuuid(userName, tag) {
        const url = `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${userName}/kr${tag}`;
        const data = await this.makeRequest(url);
        return data.puuid;  // PUUID 반환
    }

    // 소환사 ID 가져오기
    async getSummonId(puuid) {
        const url = `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
        const data = await this.makeRequest(url);
        return data.id;  // summonId 반환
    }

    // 매치 ID 가져오기
    async getMatchIds(puuid) {
        const url = `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20`;
        return await this.makeRequest(url);  // 매치 ID 배열 반환
    }

    // 소환사 랭킹 정보 가져오기
    async getRankInfo(summonId) {
        const url = `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonId}`;
        const data = await this.makeRequest(url);  // 랭킹 정보 요청

        // 필요한 항목만 추출해서 반환
        return data.map((entry) => ({
            queueType: entry.queueType,
            tier: entry.tier,
            rank: entry.rank,
            leaguePoints: entry.leaguePoints,
            wins: entry.wins,
            losses: entry.losses
        }));
    }


    // 매치 정보 가져오기
    async getMatchInfo(matchIds, puuid) {
        const matchData = [];

        for (const matchId of matchIds) {
            const url = `https://asia.api.riotgames.com/lol/match/v5/matches/${matchId}`;
            const data = await this.makeRequest(url);

            const { participants } = data.info;
            const participantInfo = participants.map((participant) => {
                if (participant.puuid === puuid) {
                    return {
                        kills: participant.kills,
                        assists: participant.assists,
                        deaths: participant.deaths,
                        kda: participant.challenges.kda,
                        win: participant.win,
                        killParticipation: participant.challenges.killParticipation,
                        gameLength: participant.challenges.gameLength,
                        championName: participant.championName
                    };
                }
            }).filter(info => info);

            if (participantInfo.length > 0) {
                matchData.push(...participantInfo);
            }
        }

        return matchData;  // 매치 정보 반환
    }
}

module.exports = new RiotStatusService();
