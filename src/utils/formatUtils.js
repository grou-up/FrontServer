export const formatNumber = (number) => {
    return new Intl.NumberFormat('ko-KR').format(number); // 한국어 형식으로 포맷
};
