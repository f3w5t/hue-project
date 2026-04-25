// الملف ده مسؤول عن تشغيل المحاكاة وحساب النتائج وعرضها في الرسم البياني
// دي المتغيرات الأساسية اللي بنستخدمها في كل الملف
let chartInstance = null; // دي بتخزن الرسم البياني علشان نمسحه ونعمل واحد جديد كل مرة
let currentLanguage = 'en'; // دي اللغة الحالية - بنبدأ بالإنجليزي
let lastSimulation = null; // دي بتخزن آخر محاكاة عشان نقدر نعرضها تاني لما نغير اللغة

// دي الترجمات للنصوص في الموقع - بالعربي والإنجليزي
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
        toggleLabel: 'العربية',
        probabilityTitle: 'Probability Law',
        formulaLabel: 'Probability Formula:',
        numerator: 'Number of favorable outcomes',
        denominator: 'Total number of possible outcomes',
        howToCalculate: 'How to calculate?',
        step1: 'Count how many times each face appeared (favorable outcomes)',
        step2: 'Divide by the total number of all faces shown (total outcomes)',
        step3: 'Multiply by 100 to get the percentage',
        exampleTitle: 'Example',
        exampleText: 'If you roll 1 die 100 times and face 6 appears 17 times:',
        calcStep1: 'Step 1:',
        calcStep2: 'Step 2:',
        calcStep3: 'Step 3:'
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
        toggleLabel: 'English',
        probabilityTitle: 'قانون الاحتمال',
        formulaLabel: 'قانون الاحتمال:',
        numerator: 'عدد النتائج المطلوبة',
        denominator: 'إجمالي عدد النتائج الممكنة',
        howToCalculate: 'كيف نحسب؟',
        step1: 'عد عدد المرات اللي ظهر فيها كل رقم (النتائج المطلوبة)',
        step2: 'اقسم على إجمالي عدد كل الأرقام اللي ظهرت (النتائج الممكنة)',
        step3: 'اضرب في 100 علشان تحصل على النسبة المئوية',
        exampleTitle: 'مثال',
        exampleText: 'لو رميت نرد واحد 100 مرة وظهر الرقم 6 17 مرة:',
        calcStep1: 'الخطوة 1:',
        calcStep2: 'الخطوة 2:',
        calcStep3: 'الخطوة 3:'
    }
};

const languageToggleButton = document.getElementById('langToggle'); // زر تغيير اللغة
const rollButton = document.getElementById('rollBtn'); // زر تشغيل المحاكاة
const statsContainer = document.getElementById('stats'); // المكان اللي بنعرض فيه النتائج

// دي دالة بتنسق الأرقام حسب اللغة المختارة (عربي أو إنجليزي)
function formatNumber(value, fractionDigits = 0) {
    return new Intl.NumberFormat(currentLanguage, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
    }).format(value);
}

// دي الدالة اللي بتغير اللغة في كل الصفحة - بتغير النصوص واتجاه الكتابة
function applyLanguage(language) {
    currentLanguage = language; // بنحفظ اللغة الجديدة
    const translation = translations[currentLanguage]; // بنجيب الترجمات بتاعت اللغة دي

    document.documentElement.lang = currentLanguage; // بنغير لغة الصفحة
    document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr'; // بنغير الاتجاه (يمين لليسار للعربي)
    document.title = translation.pageTitle; // بنغير عنوان الصفحة

    // بنروح على كل عنصر في الصفحة عنده data-i18n ونغير النص بتاعه
    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const translationKey = element.dataset.i18n;
        if (translation[translationKey]) {
            element.textContent = translation[translationKey];
        }
    });

    // لو فيه محاكاة سابقة، بنعرضها تاني باللغة الجديدة
    if (lastSimulation) {
        renderResults(lastSimulation);
    } else {
        statsContainer.innerHTML = `<p class="empty-state">${translation.emptyState}</p>`;
    }
}

// دي لما المستخدم يضغط على زر تشغيل المحاكاة
rollButton.addEventListener('click', () => {
    const numDice = parseInt(document.getElementById('numDice').value); // بنجيب عدد النرد اللي المستخدم دخل
    const numRolls = parseInt(document.getElementById('numRolls').value); // بنجيب عدد الرميات اللي المستخدم دخل

    // بنتأكد إن عدد النرد رقم صحيح وموجب
    if (isNaN(numDice) || numDice < 1) {
        alert(translations[currentLanguage].alertDice);
        return; // بنوقف لو الرقم مش صح
    }

    // بنتأكد إن عدد الرميات رقم صحيح وموجب
    if (isNaN(numRolls) || numRolls < 1) {
        alert(translations[currentLanguage].alertRolls);
        return; // بنوقف لو الرقم مش صح
    }

    // لو كل حاجة تمام، بنبدأ المحاكاة
    simulateDice(numDice, numRolls);
});

// دي لما المستخدم يضغط على زر تغيير اللغة
languageToggleButton.addEventListener('click', () => {
    const nextLanguage = currentLanguage === 'en' ? 'ar' : 'en'; // بنحسب اللغة الجديدة
    applyLanguage(nextLanguage); // بنطبق اللغة الجديدة
});

// دي الدالة الأساسية اللي بترمي النرد وتحسب النتائج
function simulateDice(numDice, numRolls) {
    const frequencies = {}; // دي اللي هتحتفظ بعدد مرات ظهور كل رقم

    // بنجهز عداد لكل رقم من 1 لـ 6 ونبديه بصفر
    for (let face = 1; face <= 6; face++) {
        frequencies[face] = 0;
    }

    // هنا بنكرر الرمية بنفس عدد المرات اللي المستخدم دخلها
    for (let rollIndex = 0; rollIndex < numRolls; rollIndex++) {
        // وكل مرة بنرمي كل النرد اللي المستخدم محددها
        for (let dieIndex = 0; dieIndex < numDice; dieIndex++) {
            // كل نرد بيطلع رقم عشوائي من 1 لـ 6
            const faceValue = Math.floor(Math.random() * 6) + 1;
            frequencies[faceValue]++; // بنزيد العداد بتاع الرقم ده
        }
    }

    // بنخزن بيانات المحاكاة دي علشان نقدر نعرضها تاني
    lastSimulation = {
        numDice,
        numRolls,
        frequencies
    };

    // وبعدها بنعرض النتائج في الصفحة
    renderResults(lastSimulation);
}

// دي الدالة اللي بتبني HTML بتاع النتائج وتعرضها في الصفحة
function renderResults(simulationData) {
    const translation = translations[currentLanguage]; // بنجيب الترجمات بتاعت اللغة الحالية
    const labels = []; // دي عشان نحفظ أرقام النرد للرسم البياني
    const dataCounts = []; // دي عشان نحفظ عدد مرات ظهور كل رقم للرسم البياني
    const totalFaces = simulationData.numDice * simulationData.numRolls; // إجمالي عدد الأرقام اللي طلعت

    // بنبدي HTML بتاع العنوان
    let statsHtml = `<h3>${translation.summaryTitle}</h3>`;
    statsHtml += `<p>${translation.rollsCountLabel}: <strong>${formatNumber(simulationData.numRolls)}</strong> | ${translation.dicePerRollLabel}: <strong>${formatNumber(simulationData.numDice)}</strong> | ${translation.totalFacesLabel}: <strong>${formatNumber(totalFaces)}</strong></p>`;

    // بنضيف قسم قانون الاحتمال
    statsHtml += `<div class="probability-law-section">`;
    statsHtml += `<h4>${translation.probabilityTitle}</h4>`;
    statsHtml += `<div class="law-formula-display">`;
    statsHtml += `<span class="formula-main">P(E) = </span>`;
    statsHtml += `<div class="fraction">`;
    statsHtml += `<span class="numerator">${translation.numerator}</span>`;
    statsHtml += `<span class="fraction-line"></span>`;
    statsHtml += `<span class="denominator">${translation.denominator}</span>`;
    statsHtml += `</div>`;
    statsHtml += `</div>`;
    statsHtml += `</div>`;

    // بنبدأ شبكة الكروت بتاعة الأرقام
    statsHtml += `<div class="stats-grid">`;

    // بنلف على كل رقم من 1 لـ 6
    for (let face = 1; face <= 6; face++) {
        labels.push(formatNumber(face)); // بنضيف الرقم للرسم البياني
        dataCounts.push(simulationData.frequencies[face]); // بنضيف العدد للرسم البياني

        // الاحتمال التجريبي الفعلي - الرقم ده ظهر قد إيه بالمئة
        const actualProbability = (simulationData.frequencies[face] / totalFaces) * 100;
        // الاحتمال النظري المتوقع - نظريًا لازم يبقى 16.67% لكل رقم (1/6)
        const expectedProbability = 16.67;
        // بنقارن النتيجة الفعلية مع المتوقع
        const comparison = actualProbability > expectedProbability ? 'higher' : (actualProbability < expectedProbability ? 'lower' : 'equal');
        const comparisonText = comparison === 'higher' ? '↑ Higher' : (comparison === 'lower' ? '↓ Lower' : '✓ Equal');
        const comparisonClass = comparison === 'higher' ? 'higher' : (comparison === 'lower' ? 'lower' : 'equal');

        // بنبني كارت لكل رقم فيه كل التفاصيل
        statsHtml += `
            <div class="stat-card ${comparisonClass}">
                <span class="stat-label">${translation.faceLabel}</span>
                <strong>${formatNumber(face)}</strong>
                <div class="result-count">${translation.countLabel}: ${formatNumber(simulationData.frequencies[face])}</div>
                <div class="calculation-steps">
                    <div class="calc-step">
                        <span class="calc-label">P(${face}) = </span>
                        <span class="calc-value">${formatNumber(simulationData.frequencies[face])} / ${formatNumber(totalFaces)}</span>
                    </div>
                    <div class="calc-step">
                        <span class="calc-label">= </span>
                        <span class="calc-value">${(simulationData.frequencies[face] / totalFaces).toFixed(4)}</span>
                    </div>
                    <div class="calc-step">
                        <span class="calc-label">= </span>
                        <span class="calc-value actual-result">${formatNumber(actualProbability, 2)}%</span>
                    </div>
                </div>
                <div class="prediction-section">
                    <div class="expected-prob">
                        <span class="pred-label">Expected:</span>
                        <span class="pred-value">${expectedProbability}%</span>
                    </div>
                    <div class="comparison-badge ${comparisonClass}">
                        ${comparisonText}
                    </div>
                </div>
            </div>`;
    }

    statsHtml += `</div>`;
    statsContainer.innerHTML = statsHtml; // بنعرض الHTML في الصفحة

    // وبعدها بنرسم الرسم البياني
    updateChart(labels, dataCounts, totalFaces, simulationData.numDice);
}

// دي الدالة اللي بترسم الرسم البياني باستخدام مكتبة Chart.js
function updateChart(labels, data, totalFaces, numDice) {
    const ctx = document.getElementById('resultChart').getContext('2d'); // بنجيب مكان الرسم في الصفحة

    // لو فيه رسم قديم، نمسحه الأول عشان الجديد ما يتراكبش عليه
    if (chartInstance) {
        chartInstance.destroy();
    }

    const translation = translations[currentLanguage]; // بنجيب الترجمات بتاعت اللغة الحالية

    // هنا بنعمل الرسم البياني الجديد
    chartInstance = new Chart(ctx, {
        type: 'bar', // نوع الرسم - أعمدة
        data: {
            labels: labels, // أرقام النرد (1-6)
            datasets: [{
                label: translation.chartDatasetLabel, // اسم البيانات
                data: data, // عدد مرات ظهور كل رقم
                backgroundColor: 'rgba(243, 178, 41, 0.8)', // لون الأعمدة - ذهبي
                borderColor: 'rgba(0, 45, 98, 1)', // لون الحدود - أزرق
                borderWidth: 2, // سمك الحدود
                borderRadius: 6 // تقريب حواف الأعمدة
            }]
        },
        options: {
            responsive: true, // الرسم بيستجيب لحجم الشاشة
            maintainAspectRatio: false, // بنسمحله يغير النسب
            plugins: {
                title: {
                    display: true, // بنعرض العنوان
                    text: numDice === 1 ? translation.chartTitleSingle : translation.chartTitleMultiple, // العنوان حسب عدد النرد
                    font: { size: 16 }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw; // عدد المرات
                            const percentage = (value / totalFaces) * 100; // بنحسب النسبة المئوية
                            return `${translation.countLabel}: ${formatNumber(value)} (${formatNumber(percentage, 2)}%)`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true, // المحور Y يبدي من الصفر
                    title: {
                        display: true,
                        text: translation.yAxisTitle, // عنوان المحور Y
                        font: { weight: 'bold' }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: translation.xAxisTitle, // عنوان المحور X
                        font: { weight: 'bold' }
                    }
                }
            }
        }
    });
}

// نبدأ دايمًا بالإنجليزي لأن ده الأصل
applyLanguage('en');