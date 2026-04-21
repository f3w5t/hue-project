// الملف ده مسؤول عن تشغيل المحاكاة وحساب النتائج وعرضها في الرسم البياني
let chartInstance = null;
let currentLanguage = 'en';
let lastSimulation = null;

const translations = {
    en: {
        pageTitle: 'Dice Simulator - Probability Project',
        badge: 'Probability Project',
        title: 'Dice Simulator 🎲',
        subtitle: 'In short: roll the dice as many times as you want and see how often each face appears.',
        introTitle: 'What does this site do?',
        introDescription: 'The simulation takes any positive number of dice and rolls, then counts how often each face appears and shows the results in a table and chart.',
        inputsCardTitle: 'Inputs',
        inputsCardText: 'Enter any positive number of dice and choose how many rolls you want to test.',
        processCardTitle: 'What happens',
        processCardText: 'Each roll produces random values from 1 to 6, and the program counts every face that appears.',
        resultCardTitle: 'Result',
        resultCardText: 'The chart shows the most frequent faces so you can understand the distribution easily.',
        diceLabel: 'Number of dice:',
        rollsLabel: 'Number of rolls:',
        rollButton: 'Run simulation',
        resultsTitle: 'Results',
        emptyState: 'Enter the values above and click "Run simulation" to see the result here.',
        alertDice: 'Please enter a valid positive number of dice.',
        alertRolls: 'Please enter a valid positive number of rolls.',
        summaryTitle: 'Simulation summary',
        rollsCountLabel: 'Rolls',
        dicePerRollLabel: 'Dice per roll',
        totalFacesLabel: 'Total faces shown',
        faceLabel: 'Face',
        countLabel: 'Count',
        percentageLabel: 'Percentage',
        chartTitleSingle: 'Face distribution for one die',
        chartTitleMultiple: 'Face distribution for multiple dice',
        chartDatasetLabel: 'Face frequency',
        yAxisTitle: 'Number of occurrences',
        xAxisTitle: 'Die face',
        toggleLabel: 'العربية'
    },
    ar: {
        pageTitle: 'محاكي النرد - مشروع الاحتمالات',
        badge: 'مشروع احتمالات مبسط',
        title: 'محاكي النرد 🎲',
        subtitle: 'ببساطة: ارمي النرد قد ما تحب وشوف كل رقم ظهر كام مرة.',
        introTitle: 'الموقع ده بيعمل إيه؟',
        introDescription: 'المحاكاة بتاخد منك أي عدد أحجار نرد وعدد مرات الرمي، وبعد كده بتحسب الأرقام اللي ظهرت فعلاً وتعرضها في جدول وفي رسم بياني سهل القراءة.',
        inputsCardTitle: 'المدخلات',
        inputsCardText: 'اكتب أي عدد نرد موجب، وحدد عدد الرميات اللي عايز تجربها.',
        processCardTitle: 'اللي بيحصل',
        processCardText: 'كل رمية بتطلع أرقام عشوائية من 1 لـ 6، وبعدها بنسجل كل رقم ظهر كام مرة.',
        resultCardTitle: 'النتيجة',
        resultCardText: 'الرسم البياني بيوضح أكتر الأرقام تكرارًا، علشان تشوف التوزيع بسهولة.',
        diceLabel: 'عدد أحجار النرد:',
        rollsLabel: 'عدد مرات الرمي:',
        rollButton: 'شغّل المحاكاة',
        resultsTitle: 'النتائج',
        emptyState: 'اكتب القيم فوق واضغط "شغّل المحاكاة" علشان النتيجة تظهر هنا.',
        alertDice: 'من فضلك اكتب عدد نرد صحيح وموجب.',
        alertRolls: 'من فضلك اكتب عدد رميات صحيح وموجب.',
        summaryTitle: 'ملخص المحاكاة',
        rollsCountLabel: 'عدد مرات الرمي',
        dicePerRollLabel: 'عدد أحجار النرد في كل مرة',
        totalFacesLabel: 'إجمالي الأرقام اللي ظهرت',
        faceLabel: 'الرقم',
        countLabel: 'عدد المرات',
        percentageLabel: 'النسبة',
        chartTitleSingle: 'توزيع الأرقام لنرد واحد',
        chartTitleMultiple: 'توزيع الأرقام لعدة نردات',
        chartDatasetLabel: 'تكرار كل رقم',
        yAxisTitle: 'عدد المرات',
        xAxisTitle: 'رقم النرد',
        toggleLabel: 'English'
    }
};

const languageToggleButton = document.getElementById('langToggle');
const rollButton = document.getElementById('rollBtn');
const statsContainer = document.getElementById('stats');

// دي بتنسق الأرقام حسب اللغة المختارة
function formatNumber(value, fractionDigits = 0) {
    return new Intl.NumberFormat(currentLanguage, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
    }).format(value);
}

// دي بتحدث النصوص الثابتة كلها في الصفحة حسب اللغة
function applyLanguage(language) {
    currentLanguage = language;
    const translation = translations[currentLanguage];

    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    document.title = translation.pageTitle;

    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const translationKey = element.dataset.i18n;
        if (translation[translationKey]) {
            element.textContent = translation[translationKey];
        }
    });

    if (lastSimulation) {
        renderResults(lastSimulation);
    } else {
        statsContainer.innerHTML = `<p class="empty-state">${translation.emptyState}</p>`;
    }
}

// دي بتربط زر تشغيل المحاكاة بالدالة الرئيسية
rollButton.addEventListener('click', () => {
    const numDice = parseInt(document.getElementById('numDice').value);
    const numRolls = parseInt(document.getElementById('numRolls').value);

    // نتأكد إن عدد النرد رقم صحيح وموجب، من غير حد أقصى
    if (isNaN(numDice) || numDice < 1) {
        alert(translations[currentLanguage].alertDice);
        return;
    }

    // نتأكد إن عدد الرميات رقم صحيح وموجب
    if (isNaN(numRolls) || numRolls < 1) {
        alert(translations[currentLanguage].alertRolls);
        return;
    }

    // لو البيانات سليمة، نبدأ المحاكاة
    simulateDice(numDice, numRolls);
});

// دي بتبدل اللغة بين إنجليزي وعربي
languageToggleButton.addEventListener('click', () => {
    const nextLanguage = currentLanguage === 'en' ? 'ar' : 'en';
    applyLanguage(nextLanguage);
});

// الدالة دي بترمي النرد عدد مرات كبير وتحسب كل رقم ظهر كام مرة
function simulateDice(numDice, numRolls) {
    const frequencies = {};

    // بنجهز عداد لكل رقم من أرقام النرد علشان النتائج تطلع كاملة وواضحة
    for (let face = 1; face <= 6; face++) {
        frequencies[face] = 0;
    }

    // هنا بنكرر الرمية بنفس عدد المرات اللي المستخدم دخلها
    for (let rollIndex = 0; rollIndex < numRolls; rollIndex++) {
        for (let dieIndex = 0; dieIndex < numDice; dieIndex++) {
            // كل نرد بيطلع رقم عشوائي من 1 لـ 6
            const faceValue = Math.floor(Math.random() * 6) + 1;
            frequencies[faceValue]++;
        }
    }

    lastSimulation = {
        numDice,
        numRolls,
        frequencies
    };

    // وبعدها بنعرض النتائج حسب اللغة الحالية
    renderResults(lastSimulation);
}

// دي بتبني النصوص والجدول والرسم البياني من نفس بيانات المحاكاة
function renderResults(simulationData) {
    const translation = translations[currentLanguage];
    const labels = [];
    const dataCounts = [];
    const totalFaces = simulationData.numDice * simulationData.numRolls;

    let statsHtml = `<h3>${translation.summaryTitle}</h3>`;
    statsHtml += `<p>${translation.rollsCountLabel}: <strong>${formatNumber(simulationData.numRolls)}</strong> | ${translation.dicePerRollLabel}: <strong>${formatNumber(simulationData.numDice)}</strong> | ${translation.totalFacesLabel}: <strong>${formatNumber(totalFaces)}</strong></p>`;
    statsHtml += `<div class="stats-grid">`;

    for (let face = 1; face <= 6; face++) {
        labels.push(formatNumber(face));
        dataCounts.push(simulationData.frequencies[face]);

        // دي النسبة التجريبية: الرقم ده ظهر قد إيه من إجمالي الأرقام اللي طلعت
        const probability = (simulationData.frequencies[face] / totalFaces) * 100;

        statsHtml += `
            <div class="stat-card">
                <span class="stat-label">${translation.faceLabel}</span>
                <strong>${formatNumber(face)}</strong>
                <div>${translation.countLabel}: ${formatNumber(simulationData.frequencies[face])}</div>
                <div>${translation.percentageLabel}: ${formatNumber(probability, 2)}%</div>
            </div>`;
    }

    statsHtml += `</div>`;
    statsContainer.innerHTML = statsHtml;

    // وبعدها بنرسم الشكل البياني علشان يبقى الفهم أسرع
    updateChart(labels, dataCounts, totalFaces, simulationData.numDice);
}

// الدالة دي مسؤولة عن رسم المخطط الشريطي وتحديثه كل مرة
function updateChart(labels, data, totalFaces, numDice) {
    const ctx = document.getElementById('resultChart').getContext('2d');

    // لو فيه رسم قديم، نمسحه الأول عشان الجديد ما يتراكبش عليه
    if (chartInstance) {
        chartInstance.destroy();
    }

    const translation = translations[currentLanguage];

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: translation.chartDatasetLabel,
                data: data,
                backgroundColor: 'rgba(243, 178, 41, 0.8)',
                borderColor: 'rgba(0, 45, 98, 1)',
                borderWidth: 2,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: numDice === 1 ? translation.chartTitleSingle : translation.chartTitleMultiple,
                    font: { size: 16 }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const percentage = (value / totalFaces) * 100;
                            return `${translation.countLabel}: ${formatNumber(value)} (${formatNumber(percentage, 2)}%)`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: translation.yAxisTitle,
                        font: { weight: 'bold' }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: translation.xAxisTitle,
                        font: { weight: 'bold' }
                    }
                }
            }
        }
    });
}

// نبدأ دايمًا بالإنجليزي لأن ده الأصل
applyLanguage('en');