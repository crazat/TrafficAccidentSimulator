// Constants
const CONSOLATION_MINOR = 150000; // 경상 위로금
const TRANSPORT_PER_VISIT = 8000; // 통원 1회당 교통비
const LIABILITY_LIMIT_MINOR = 1200000; // 책임보험 경상 한도 (120만원)

// DOM Elements
const faultRatioInput = document.getElementById('faultRatio');
const userInsuranceSection = document.getElementById('userInsuranceSection');
const premiumSection = document.getElementById('premiumSection');

// Event Listeners
faultRatioInput.addEventListener('input', toggleUserInsurance);
document.getElementById('injuryGrade').addEventListener('change', updateFutureTreatmentTip);

function toggleTip() {
    const tipBox = document.getElementById('futureTreatmentTip');
    updateFutureTreatmentTip(); // Ensure content is correct before showing
    tipBox.classList.toggle('hidden');
}

function updateFutureTreatmentTip() {
    const injuryGrade = document.getElementById('injuryGrade').value;
    const tipContent = document.querySelector('#futureTreatmentTip .tip-content');
    const tipTitle = document.querySelector('#futureTreatmentTip h3');
    const tipIntro = document.querySelector('#futureTreatmentTip > p');

    if (injuryGrade === 'serious') {
        // 중상 (11급 이상 / 골절)
        tipTitle.textContent = "💡 중상(골절 등) 향후치료비 핵심";
        tipIntro.innerHTML = `<strong>향후치료비란?</strong> 합의 이후 발생할 치료비입니다. 중상(골절 등)의 경우 <strong>단순 협상이 아닌, 의학적 소견(추정서)에 의해 산정</strong>되는 것이 원칙입니다.`;

        tipContent.innerHTML = `
            <h4>협상 전략 (의학적 근거 필수):</h4>
            <ul>
                <li><strong>향후치료비 추정서 발급:</strong> 주치의가 작성한 '향후치료비 추정서'가 절대적인 기준이 됩니다.</li>
                <li><strong>주요 인정 항목:</strong>
                    <ul>
                        <li>핀 제거 수술비 (금속 내고정물 제거)</li>
                        <li>흉터 성형 수술비 (반흔 성형술)</li>
                        <li>재활 치료비 (도수치료 등 비급여 항목 포함 가능성)</li>
                    </ul>
                </li>
                <li><strong>주의사항:</strong> 섣불리 합의하기보다, 핀 제거 시기나 치료 종결 시점에 맞춰 정확한 견적을 받는 것이 유리합니다.</li>
            </ul>
            <p class="tip-note">※ 골절 환자는 수백만 원 단위의 핀 제거/성형 비용이 발생하므로, 단순 위로금 명목으로 합의하면 손해를 볼 수 있습니다.</p>
        `;
    } else {
        // 경상 (12~14급) - 기본값
        tipTitle.textContent = "💡 향후치료비 협상 꿀팁";
        tipIntro.innerHTML = `<strong>향후치료비란?</strong> 합의 이후에 발생할 것으로 예상되는 치료비를 미리 당겨서 받는 금액입니다. 정해진 공식이 없어 <strong>가장 유연하게 협상할 수 있는 항목</strong>입니다.`;

        tipContent.innerHTML = `
            <h4>협상 전략:</h4>
            <ul>
                <li><strong>구체적인 치료 계획 제시:</strong> "아직 통증이 심해 3주 이상 물리치료와 약침 치료가 더 필요하다"고 구체적으로 어필하세요.</li>
                <li><strong>고가 검사/치료 언급:</strong> "통증이 지속되면 MRI 촬영이나 추나요법을 받을 예정이다"라고 하면, 보험사는 이를 방어하기 위해 합의금을 높일 수 있습니다.</li>
                <li><strong>심리적 우위:</strong> "지금 합의 안 하고 치료를 더 받겠다"는 태도는 보험사 입장에서 관리 비용 증가로 이어지므로 강력한 협상 카드가 됩니다.</li>
            </ul>
            <p class="tip-note">※ 통상적으로 경상 환자의 경우 30~50만원에서 시작하여, 협상 능력에 따라 100만원 이상으로 책정되기도 합니다.</p>
        `;
    }
}

function applyDailyWage() {
    const input = document.getElementById('dailyIncome');
    const btn = document.querySelector('.btn-small');

    // 2023/2024 기준 도시일용노임: 118,000원
    if (parseInt(input.value) === 118000) {
        // 이미 적용된 상태면 취소 (기본값 70,000원으로 복귀 - 최저시급 기준)
        input.value = 70000;
        if (btn) {
            btn.textContent = "취소됨 (기본값)";
            setTimeout(() => btn.textContent = "주부/학생/무직 (소득증빙 어려움)", 1000);
        }
    } else {
        // 적용
        input.value = 118000;
        if (btn) {
            btn.textContent = "적용됨 (118,000원)";
            setTimeout(() => btn.textContent = "주부/학생/무직 (소득증빙 어려움)", 1000);
        }
    }
}

function saveResultImage() {
    const resultSection = document.querySelector('.result-section');
    const btnSave = document.getElementById('btnSave');

    // 버튼 숨기고 캡처
    if (btnSave) btnSave.style.display = 'none';

    html2canvas(resultSection, {
        backgroundColor: '#0f172a', // Christmas theme dark background
        scale: 2 // 고화질
    }).then(canvas => {
        // 이미지 다운로드
        const link = document.createElement('a');
        link.download = '교통사고_합의금_계산결과.png';
        link.href = canvas.toDataURL();
        link.click();

        // 버튼 다시 표시
        if (btnSave) btnSave.style.display = 'flex';
    });
}

function toggleUserInsurance() {
    const fault = parseInt(faultRatioInput.value) || 0;
    updateFaultGuidance(fault); // Update guidance text

    if (fault > 0) {
        userInsuranceSection.classList.remove('hidden');
        premiumSection.classList.remove('hidden');
    } else {
        userInsuranceSection.classList.add('hidden');
        premiumSection.classList.add('hidden');
    }
}

function updateFaultGuidance(fault) {
    const guidanceBox = document.getElementById('faultGuidance');
    if (fault <= 0) {
        guidanceBox.classList.add('hidden');
        return;
    }

    // Interpolation Logic based on user data:
    // 90% -> 300
    // 50% -> 480
    // 30% -> 730
    let estimatedLimit = 0;

    if (fault >= 90) {
        estimatedLimit = 3000000; // Base for high fault
    } else if (fault >= 50) {
        // Range 90 to 50: 300 to 480
        // Slope: (480-300)/(50-90) = 180/-40 = -4.5 (manwon per %)
        // Value = 300 + (90 - fault) * 4.5
        estimatedLimit = 3000000 + (90 - fault) * 45000;
    } else if (fault >= 30) {
        // Range 50 to 30: 480 to 730
        // Slope: (730-480)/(30-50) = 250/-20 = -12.5
        // Value = 480 + (50 - fault) * 12.5
        estimatedLimit = 4800000 + (50 - fault) * 125000;
    } else {
        // Range < 30: Extrapolate or Cap?
        // Let's assume it continues to rise but maybe cap at some reasonable amount or just show "730만원 이상"
        estimatedLimit = 7300000 + (30 - fault) * 125000;
    }

    // Round to nearest 10,000 for cleaner look
    estimatedLimit = Math.round(estimatedLimit / 10000) * 10000;

    guidanceBox.textContent = `💡 과실 ${fault}% 기준, 통상 치료비 보장 한도: 약 ${formatCurrency(estimatedLimit)} 내외`;
    guidanceBox.classList.remove('hidden');
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('ko-KR').format(Math.floor(amount)) + '원';
}

function calculateSettlement() {
    // 1. Get Inputs
    const accidentType = document.getElementById('accidentType').value;
    const injuryGrade = document.getElementById('injuryGrade').value;
    const faultRatio = parseInt(document.getElementById('faultRatio').value) || 0;
    const opponentInsurance = document.getElementById('opponentInsurance').value;
    const myInsurance = document.getElementById('myInsurance').value;
    const annualPremium = parseInt(document.getElementById('annualPremium').value) || 0;

    const hospitalDays = parseInt(document.getElementById('hospitalDays').value) || 0;
    const outpatientVisits = parseInt(document.getElementById('outpatientVisits').value) || 0;
    const dailyIncome = parseInt(document.getElementById('dailyIncome').value) || 0;
    const futureTreatment = parseInt(document.getElementById('futureTreatment').value) || 0;

    // 2. Base Calculation
    let consolation = 0;
    if (injuryGrade === 'minor') consolation = CONSOLATION_MINOR;
    else consolation = 250000; // 중상 임의 설정

    // 휴업손해: 1일 소득 * 85% * 입원일수
    const lostIncome = (dailyIncome * 0.85) * hospitalDays;

    // 통원교통비: 8000 * 횟수
    const transportCost = TRANSPORT_PER_VISIT * outpatientVisits;

    // 향후치료비
    const futureCost = futureTreatment;

    // 소계
    let subTotal = consolation + lostIncome + transportCost + futureCost;
    let finalAmount = subTotal;
    let faultDeduction = 0;

    // 3. Logic & Scenarios
    let advice = "";
    let adviceClass = "advice-box"; // default, warning, danger
    let showSurcharge = false;
    let surchargeTotal = 0;

    // Scenario Logic
    if (accidentType === 'car_person' || accidentType === 'passenger') {
        // 이륜차/보행자/동승자
        advice = "<strong>[교통약자/동승자]</strong><br>과실 여부와 상관없이 치료비 전액을 상대방이 보상합니다. 치료비가 늘어나도 합의금이 줄어들지 않으니 충분히 치료받으세요.";
        faultDeduction = 0;
    } else if (opponentInsurance === 'liability') {
        // 상대방 책임보험 (로직은 아래에서 별도 처리)
        advice = "<strong>[상대방 책임보험]</strong><br>주의하세요! 상대방이 책임보험만 가입했습니다. 경상 기준 총 한도(치료비+합의금)가 120만원입니다.";
        adviceClass = "advice-box danger";
    } else {
        // 차대차 사고 (일반)
        if (faultRatio === 0) {
            advice = "<strong>[무과실 피해자]</strong><br>치료비가 합의금에서 차감되지 않습니다. 충분히 치료받고 합의하셔도 됩니다.";
        } else {
            showSurcharge = true;
            surchargeTotal = annualPremium * 0.07 * 3; // 7% * 3년

            // 실익 계산 (합의금 - 예상 할증액)
            const netBenefit = finalAmount - surchargeTotal;

            if (myInsurance === 'jasang') {
                advice = "<strong>[자동차상해(자상) 가입자]</strong><br>본인 과실이 있어도 치료비와 합의금이 모두 보장됩니다.<br><strong>'치료비가 늘어나면 합의금이 줄어든다'는 말은 거짓입니다!</strong><br>충분히 치료받으시고 합의하셔도 됩니다.<br><br>단, <strong>합의금을 받으면 보험료가 할증</strong>됩니다. 아래 '실익 계산'을 확인하세요.";
                faultDeduction = 0;
            } else if (myInsurance === 'jason') {
                advice = "<strong>[자기신체사고(자손) 가입자]</strong><br>치료비는 보장되나, <strong>합의금은 본인 과실 비율만큼 차감(감가)</strong>되어 산정됩니다.<br>(예: 과실 90%여도 약 300만원까지는 치료비 보장)<br><br><strong>합의금을 받으면 보험료가 할증</strong>됩니다. 아래 '실익 계산'을 확인하세요.";
                faultDeduction = subTotal * (faultRatio / 100);
                finalAmount = subTotal - faultDeduction;
            } else {
                advice = "<strong>[자상/자손 미가입]</strong><br>본인 과실만큼 합의금이 크게 줄어듭니다. 할증액보다 합의금이 적다면 <strong>합의금을 포기하고 할증을 피하는 것</strong>이 유리할 수 있습니다.";
                faultDeduction = subTotal * (faultRatio / 100);
                finalAmount = subTotal - faultDeduction;
            }

            // 실익에 따른 추가 조언
            if (netBenefit < 0) {
                advice += `<br><br><strong>💡 추천 전략: 합의금 포기 (치료만 받기)</strong><br>예상 합의금(${formatCurrency(finalAmount)})보다 보험료 할증(${formatCurrency(surchargeTotal)})이 더 큽니다.<br><strong>합의금을 안 받고 치료만(120만원 한도 내) 받으면 할증되지 않습니다.</strong>`;
                adviceClass = "advice-box warning";
            } else {
                advice += `<br><br><strong>💡 추천 전략: 합의 진행</strong><br>할증(${formatCurrency(surchargeTotal)})을 고려해도 합의금을 받는 것이 ${formatCurrency(netBenefit)} 더 이득입니다.<br>(치료도 받고 합의금도 챙기세요!)`;
            }
        }
    }

    // 책임보험 한도 로직 (Limit 120만원 - 치료비 = 합의금)
    if (opponentInsurance === 'liability' && injuryGrade === 'minor') {
        // 치료비 추산 (입원 15만원/일, 통원 5만원/회 가정)
        const estimatedMedicalCost = (hospitalDays * 150000) + (outpatientVisits * 50000);
        const remainingLimit = LIABILITY_LIMIT_MINOR - estimatedMedicalCost;

        if (remainingLimit < 0) {
            // 한도 초과
            finalAmount = 0; // 합의금 없음 (치료비로 다 씀)
            advice = "<strong>[책임보험 한도 초과]</strong><br>치료비가 책임보험 한도(120만원)를 초과했습니다. 상대방 보험사에서는 더 이상 보상받을 수 없습니다.<br><br><strong>💡 해결책:</strong> 본인의 <strong>'무보험차상해'</strong>나 <strong>'자상/자손'</strong>으로 처리하세요. 내 보험사가 먼저 보상하고 상대방에게 구상권을 청구합니다. 이 경우에도 합의금 산정이 가능합니다!";
            adviceClass = "advice-box danger";
        } else {
            // 한도 내
            // 합의금은 (계산된 합의금)과 (남은 한도) 중 작은 금액
            if (finalAmount > remainingLimit) {
                finalAmount = remainingLimit;
                advice += `<br><br>※ 책임보험 한도(120만원) 내에서 치료비를 제외한 잔여 금액만 합의금으로 지급됩니다.<br>(예상 치료비: ${formatCurrency(estimatedMedicalCost)} 차감됨)`;
            }
        }
    }

    // 4. Update UI
    document.getElementById('consolationMoney').textContent = formatCurrency(consolation);
    document.getElementById('lostIncome').textContent = formatCurrency(lostIncome);
    document.getElementById('transportCost').textContent = formatCurrency(transportCost);
    document.getElementById('futureCost').textContent = formatCurrency(futureCost);

    const faultRow = document.getElementById('faultDeductionRow');
    if (faultDeduction > 0) {
        faultRow.style.display = 'flex';
        document.getElementById('faultDeduction').textContent = '-' + formatCurrency(faultDeduction);
    } else {
        faultRow.style.display = 'none';
    }

    document.getElementById('totalAmount').textContent = formatCurrency(Math.max(0, finalAmount));

    const adviceBox = document.getElementById('adviceBox');
    adviceBox.innerHTML = advice;
    adviceBox.className = adviceClass;

    const surchargeSection = document.getElementById('surchargeSection');
    if (showSurcharge) {
        surchargeSection.classList.remove('hidden');
        document.getElementById('surchargeAmount').textContent = formatCurrency(surchargeTotal);

        // 할증 안내 문구 구체화
        const surchargeTitle = surchargeSection.querySelector('.surcharge-title span');
        if (surchargeTitle) surchargeTitle.textContent = "⚠️ 보험료 할증 예상 (합의금 수령 시)";
    } else {
        surchargeSection.classList.add('hidden');
    }

    // 저장 버튼 표시
    const btnSave = document.getElementById('btnSave');
    if (btnSave) btnSave.classList.remove('hidden');
}

// Modal Functions
function openLogoModal() {
    const modal = document.getElementById('logoModal');
    modal.classList.remove('hidden');
    // Force reflow to enable transition
    void modal.offsetWidth;
    modal.classList.add('show');
}

function closeLogoModal() {
    const modal = document.getElementById('logoModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300); // Wait for transition to finish
}

// Close modal on Escape key
document.addEventListener('keydown', function (event) {
    if (event.key === "Escape") {
        closeLogoModal();
    }
});
