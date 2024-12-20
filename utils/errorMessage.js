const errorMessage = (res, statusCode) => {
  switch (statusCode) {
    case 400:
      return res.status(400).json({
        errorCode: "BAD_REQUEST",
        message: "요청 파라미터가 잘못되었습니다."
      });
    case 401:
      return res.status(401).json({
        "errorCode": "UNAUTHORIZED",
        "message": "회원 인증이 필요합니다."
      });
    case 403:
      return res.status(403).json({
        "errorCode": "FORBIDDEN",
        "message": "수정할 권한이 없습니다."
      });
    case 404:
      return res.status(404).json({
        errorCode: "NOT_FOUND",
        message: "해당 내용이 없습니다."
      });
    case 500: 

    return res.status(500).json({
        errorCode: "INTERNAL_SERVER_ERROR",
        message: "서버 내부에서 에러가 발생했습니다."
      });
    default:
      break;
  }
}

module.exports = errorMessage;