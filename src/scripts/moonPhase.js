// This function needs the calculated `currentMoonAge` from the backend context, 
// so we will export a wrapper function that takes it as an argument.
export function drawMoon(currentMoonAge) {
    const canvas = document.getElementById('moonCanvas');
    const ctx = canvas.getContext('2d');
    const radius = 98;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const age = parseFloat(currentMoonAge);
    const phase = age / 29.530588853;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ダーク部分と光る部分の色
    const colorDark = '#0f172a';
    const colorLit = '#e2e2e2ff';

    // 1. まずベースをダークグレー（影）で塗りつぶす
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = colorDark;
    ctx.fill();

    // 2. 光る半円を描画
    ctx.fillStyle = colorLit;
    ctx.beginPath();
    if (phase < 0.5) {
        // Waxing（満ちていく）: 右半分が光る
        ctx.arc(centerX, centerY, radius, -Math.PI / 2, Math.PI / 2);
    } else {
        // Waning（欠けていく）: 左半分が光る
        ctx.arc(centerX, centerY, radius, Math.PI / 2, -Math.PI / 2);
    }
    ctx.fill();

    // 3.  terminator（明暗境界線）となる楕円の描画
    let isTerminatorLit = false;
    let terminatorWidth = 0;

    if (phase < 0.25) {
        isTerminatorLit = false;
        terminatorWidth = radius * (1 - phase * 4);
    } else if (phase < 0.5) {
        isTerminatorLit = true;
        terminatorWidth = radius * ((phase - 0.25) * 4);
    } else if (phase < 0.75) {
        isTerminatorLit = true;
        terminatorWidth = radius * (1 - (phase - 0.5) * 4);
    } else {
        isTerminatorLit = false;
        terminatorWidth = radius * ((phase - 0.75) * 4);
    }

    ctx.beginPath();
    // 楕円を描いて影を食い込ませるか、光を拡張させる
    ctx.ellipse(centerX, centerY, Math.abs(terminatorWidth), radius, 0, 0, 2 * Math.PI);
    ctx.fillStyle = isTerminatorLit ? colorLit : colorDark;
    ctx.fill();

    // 全体の輪郭線
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();
}
