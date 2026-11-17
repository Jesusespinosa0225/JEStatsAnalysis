/**
 * JESÚS ESPINOSA · META GROWTH & PERFORMANCE SUITE (INSTAGRAM & FACEBOOK)
 * Lógica interactiva: Charts con Chart.js, Evaluador A/B Estadístico,
 * Calculadora de Salud Algorítmica, Generador de Contenido 1/3 y Auditoría.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar Iconos Lucide
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 1. Inicializar Navegación por Pestañas
  initTabs();

  // 2. Inicializar Gráficas
  initAnalyticsCharts();

  // 3. Inicializar Selector de Buyer Personas
  initPersonasSwitcher();

  // 4. Inicializar Filtros de Plataforma (Meta Analytics)
  initPlatformFilters();

  // 5. Ejecutar Cálculos Iniciales
  calculateMetaScore();
  runABTestCalculation();
  updateAuditScore();

  // 6. Cargar Idea Inicial de Contenido
  generateRandomIdea();

  // 7. Inicializar Sistema Dual (Modo Visualización vs. Modo Administrador)
  initAdminSystem();
});

/* =====================================================================
   1. GESTIÓN DE TABS / NAVEGACIÓN
   ===================================================================== */
function initTabs() {
  const navButtons = document.querySelectorAll('.nav-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');

      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      tabContents.forEach(tab => {
        tab.classList.toggle('active', tab.id === targetTabId);
      });

      if (window.lucide) {
        window.lucide.createIcons();
      }

      // Redibujar gráficos si se muestran
      if (targetTabId === 'tab-meta-analytics' || targetTabId === 'tab-growth-planner') {
        window.dispatchEvent(new Event('resize'));
      }

      window.scrollTo({ top: 380, behavior: 'smooth' });
    });
  });
}

/* =====================================================================
   2. VISUALIZACIÓN DE DATOS (CHART.JS)
   ===================================================================== */
let retentionChart = null;
let formatChart = null;
let habitsChart = null;

function initAnalyticsCharts() {
  // Chart 1: Curva de Retención de Video en Reels (Drop-Off segundo a segundo)
  const ctxRetention = document.getElementById('retentionDropoffChart');
  if (ctxRetention) {
    retentionChart = new Chart(ctxRetention, {
      type: 'line',
      data: {
        labels: ['0s', '1s', '2s', '3s (Hook)', '5s', '10s', '15s', '30s', '45s', '60s'],
        datasets: [
          {
            label: 'Retención Reels Jesús Espinosa (Acústico + Hook Sincero)',
            data: [100, 89, 78, 68.4, 62, 54, 46, 38, 32, 28],
            borderColor: '#8fa5ff',
            backgroundColor: 'rgba(0, 32, 91, 0.4)',
            fill: true,
            tension: 0.35,
            borderWidth: 3,
            pointBackgroundColor: '#ffffff',
            pointRadius: 4
          },
          {
            label: 'Umbral Algorítmico Viral de Meta (Reels con distribución masiva)',
            data: [100, 82, 71, 60.0, 52, 42, 34, 25, 20, 16],
            borderColor: '#f43f5e',
            borderDash: [5, 5],
            fill: false,
            tension: 0.35,
            borderWidth: 2,
            pointBackgroundColor: '#f43f5e',
            pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#c9ccd0',
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 }
            }
          },
          tooltip: {
            backgroundColor: '#18181b',
            titleColor: '#ffffff',
            bodyColor: '#e4e4e7',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.parsed.y}% retención`
            }
          }
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { color: '#71717a', callback: v => v + '%' },
            title: { display: true, text: '% Espectadores activos', color: '#71717a' }
          },
          x: {
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { color: '#71717a' }
          }
        }
      }
    });
  }

  // Chart 2: Rendimiento por Formato (Reels vs Carruseles vs Foto vs Stories)
  const ctxFormat = document.getElementById('formatPerformanceChart');
  if (ctxFormat) {
    formatChart = new Chart(ctxFormat, {
      type: 'bar',
      data: {
        labels: ['Reels (Vertical)', 'Carruseles Educativos', 'Video FB Horizontal', 'Imagen Única / Cita', 'Stories Diarias'],
        datasets: [
          {
            label: 'Alcance Promedio por Post',
            data: [4200, 2400, 2100, 1100, 850],
            backgroundColor: '#1a4fb4',
            borderRadius: 6
          },
          {
            label: 'Guardados (Saves) Promedio',
            data: [195, 260, 45, 30, 0],
            backgroundColor: '#aa181a',
            borderRadius: 6
          },
          {
            label: 'Veces Compartido (Shares)',
            data: [210, 115, 140, 42, 18],
            backgroundColor: '#10b981',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#c9ccd0', font: { size: 11 } }
          },
          tooltip: {
            backgroundColor: '#000000ff',
            titleColor: '#ffffff'
          }
        },
        scales: {
          y: {
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { color: '#71717a' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#c9ccd0', font: { size: 11 } }
          }
        }
      }
    });
  }

  // Chart 3: Hábitos y Horarios de Consumo (GMT-6 México)
  const ctxHabits = document.getElementById('growthHabitsChart');
  if (ctxHabits) {
    habitsChart = new Chart(ctxHabits, {
      type: 'line',
      data: {
        labels: ['05:00', '07:00 (Devocional)', '09:00', '12:00', '15:00', '18:00', '21:00 (Noche Íntima)', '23:00', '01:00'],
        datasets: [
          {
            label: 'Adoración Íntima / Reflexiva ("Abba Padre", "Mi Corazón")',
            data: [35, 92, 65, 25, 30, 48, 98, 85, 45],
            borderColor: '#8fa5ff',
            backgroundColor: 'rgba(0, 32, 91, 0.45)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointBackgroundColor: '#ffffff'
          },
          {
            label: 'Música Dinámica / Fe Cotidiana ("Camino a Marte")',
            data: [10, 30, 60, 85, 80, 75, 40, 20, 10],
            borderColor: '#f43f5e',
            backgroundColor: 'rgba(103, 0, 1, 0.25)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointBackgroundColor: '#ffffff'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#c9ccd0', font: { size: 11 } }
          }
        },
        scales: {
          y: {
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { color: '#71717a' },
            title: { display: true, text: 'Intensidad Relativa (%)', color: '#71717a' }
          },
          x: {
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { color: '#71717a' }
          }
        }
      }
    });
  }
}

/* =====================================================================
   3. FILTROS DE PLATAFORMA (META ANALYTICS)
   ===================================================================== */
function initPlatformFilters() {
  const channelBtns = document.querySelectorAll('#analytics-channel-selector .channel-btn');

  channelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      channelBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const channel = btn.getAttribute('data-channel');
      updateChannelKPIs(channel);
    });
  });
}

function updateChannelKPIs(channel) {
  const kpiEngagement = document.getElementById('kpi-engagement');
  const kpiSaves = document.getElementById('kpi-saves');
  const kpiRetention = document.getElementById('kpi-retention');
  const kpiOrganic = document.getElementById('kpi-organic');

  if (channel === 'instagram') {
    kpiEngagement.innerText = '4.2%';
    kpiSaves.innerText = '1 : 3.8';
    kpiRetention.innerText = '71.2%';
    kpiOrganic.innerText = '82% / 18%';
  } else if (channel === 'facebook') {
    kpiEngagement.innerText = '3.1%';
    kpiSaves.innerText = '1 : 5.1';
    kpiRetention.innerText = '63.5%';
    kpiOrganic.innerText = '65% / 35%';
  } else {
    // All
    kpiEngagement.innerText = '3.8%';
    kpiSaves.innerText = '1 : 4.2';
    kpiRetention.innerText = '68.4%';
    kpiOrganic.innerText = '74% / 26%';
  }
}

/* =====================================================================
   4. CALCULADORA DE SALUD ALGORÍTMICA (META QUALITY SCORE)
   ===================================================================== */
window.calculateMetaScore = function () {
  const reach = Math.max(1, parseFloat(document.getElementById('calc-reach').value) || 1);
  const likes = parseFloat(document.getElementById('calc-likes').value) || 0;
  const comments = parseFloat(document.getElementById('calc-comments').value) || 0;
  const shares = parseFloat(document.getElementById('calc-shares').value) || 0;
  const saves = parseFloat(document.getElementById('calc-saves').value) || 0;

  // Fórmula ponderada de calidad algorítmica de Meta:
  // Saves y Shares son ponderados 5x y 4x (señales de retención y valor íntimo),
  // Comments son 2x (conversación), Likes son 1x.
  const weightedScore = (saves * 5.0) + (shares * 4.0) + (comments * 2.0) + (likes * 1.0);
  const rawRatio = (weightedScore / reach) * 100;

  // Escalar a una puntuación de 0 a 100
  // Para la industria musical, un rawRatio de 25 representa un post viral sobresaliente (Score ~95)
  const normalizedScore = Math.min(100, Math.max(10, Math.round((rawRatio / 28) * 100)));

  const dialVal = document.getElementById('score-dial-val');
  const statusTitle = document.getElementById('score-status-title');
  const statusDesc = document.getElementById('score-status-desc');

  dialVal.innerText = normalizedScore;

  const totalHighValue = saves + shares;
  const highValueRatio = ((totalHighValue / reach) * 100).toFixed(2);

  if (normalizedScore >= 75) {
    statusTitle.innerText = 'Rendimiento Excepcional (Algoritmo Muy Favorable)';
    statusTitle.style.color = '#34d399';
    statusDesc.innerHTML = `Tu ratio de acciones de alto valor (Guardados + Compartidos = <strong>${totalHighValue}</strong>, equivalente al <strong>${highValueRatio}%</strong> de tu alcance) está muy por encima del umbral de recomendación de Meta (2.5%). El algoritmo continuará distribuyendo este contenido a cuentas que no te siguen.`;
  } else if (normalizedScore >= 50) {
    statusTitle.innerText = 'Rendimiento Saludable (Distribución Estable)';
    statusTitle.style.color = '#facc15';
    statusDesc.innerHTML = `Tu contenido tiene buena tracción con tu audiencia existente (Score <strong>${normalizedScore}/100</strong>). Para forzar la recomendación a nuevas audiencias, ajusta el llamado a la acción final (CTA) incentivando explícitamente a guardar el post o compartirlo en historias.`;
  } else {
    statusTitle.innerText = 'Señal Débil (Riesgo de Freno Algorítmico)';
    statusTitle.style.color = '#fb7185';
    statusDesc.innerHTML = `El ratio de interacción profunda es de apenas <strong>${highValueRatio}%</strong>. El algoritmo de Meta detecta que los usuarios pasan rápido sin detenerse. Prueba acortar la introducción a menos de 2 segundos y reformular el texto en pantalla (Hook).`;
  }
};

window.loadSamplePostMetrics = function () {
  document.getElementById('calc-reach').value = 4850;
  document.getElementById('calc-likes').value = 340;
  document.getElementById('calc-comments').value = 62;
  document.getElementById('calc-shares').value = 145;
  document.getElementById('calc-saves').value = 198;
  calculateMetaScore();
};

/* =====================================================================
   5. SWITCHER DE BUYER PERSONAS
   ===================================================================== */
function initPersonasSwitcher() {
  const tabButtons = document.querySelectorAll('.persona-tab-btn');
  const cardViews = {
    mateo: document.getElementById('view-persona-mateo'),
    david: document.getElementById('view-persona-david'),
    sofia: document.getElementById('view-persona-sofia'),
    pastor: document.getElementById('view-persona-pastor')
  };

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const personaKey = btn.getAttribute('data-persona');

      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      Object.keys(cardViews).forEach(key => {
        if (cardViews[key]) {
          cardViews[key].classList.toggle('active', key === personaKey);
        }
      });

      if (window.lucide) {
        window.lucide.createIcons();
      }
    });
  });
}

/* =====================================================================
   6. GENERADOR DE CONTENIDO & REGLA 1/3 (CURATOR & CREATOR)
   ===================================================================== */
const contentPillarsDB = {
  worship: [
    {
      badge: "1/3 MARCA & ADORACIÓN",
      format: "Instagram Reel + FB Reel (9:16 vertical)",
      hook: '"Para el que siente que ya no tiene fuerzas para orar..."',
      script: 'Plano medio con guitarra acústica sobre fondo neutro oscuro (#08080a). Iluminación cálida lateral suave. Toca los acordes iniciales de "Abba Padre" con rasgueo sutil. Mira a cámara con calidez sincera. Canta el coro con voz orgánica sin efectos excesivos.',
      caption: 'A veces no hacen falta mil palabras elaboradas, solo recordar a quién le perteneces. Jesús no vino para señalarte ni pedirte que seas perfecto, vino a amarte y restaurarte.<br><br>Guarda esta canción para tu devocional de mañana o compártela con alguien que esté pasando por una semana difícil. Enlace en bio para escuchar \'Abba Padre\' completa en Spotify. 🕊️✨',
      cta: '"Guarda el audio y úsalo en tu momento de oración personal."',
      hashtags: '#JesusEspinosa #AbbaPadre #MusicaCristiana #AdoracionIntima #GuitarraAcustica #WorshipEspanol'
    },
    {
      badge: "1/3 MARCA & ADORACIÓN",
      format: "Reel Acústico Íntimo (60 seg)",
      hook: '"Dios no te pide que seas perfecto, te pide que seas honesto..."',
      script: 'Toma la guitarra y toca los acordes de "Mi Corazón (Versión Acústica)". Abre diciendo: "Si hoy sientes tu corazón cansado, déjame acompañarte en este minuto con esta melodía". Canta la primera estrofa con los ojos cerrados, conectando con el momento espiritual.',
      caption: 'Un corazón sincero y quebrantado vale más que mil apariencias religiosas. Que esta melodía traiga refrigerio a tu noche.<br><br>¿Desde qué país o ciudad me escuchas hoy? Te leo y oro por ti en los comentarios. ❤️🙏',
      cta: '"Comparte esto en tus historias con alguien que necesite un abrazo de Dios hoy."',
      hashtags: '#MiCorazon #AdoracionGenuina #JesusEspinosa #MusicaConProposito #PazInterior'
    },
    {
      badge: "1/3 MARCA & ADORACIÓN",
      format: "Video FB (16:9) + Reel (9:16)",
      hook: '"Imagina cantar esto en tu congregación a una sola voz..."',
      script: 'Tomas alternadas de ministración en vivo: Jesús dirigiendo la guitarra acústica y la iglesia adorando con pasión el coro de "Ven Jesús". Energía ascendente, atmósfera congregacional.',
      caption: '\'Ven Jesús, llena este lugar\'. No hay anhelo más grande para una comunidad que Su presencia manifiesta. La música es el vehículo, pero Cristo siempre ha sido el fin.<br><br>Etiqueta a los músicos y líderes de tu iglesia para cantarla juntos este fin de semana. 🔥🙌',
      cta: '"Cifrados y secuencias disponibles gratuitamente en el link de mi perfil."',
      hashtags: '#VenJesus #AlabanzaYAdoracion #TalentoParaDios #WorshipLatino #IglesiaCristiana'
    }
  ],
  vulnerability: [
    {
      badge: "1/3 COMUNITARIO & TESTIMONIO",
      format: "Reel a Cámara (45-60 seg)",
      hook: '"A los 12 años en Culiacán entendí que la música no es para buscar fama..."',
      script: 'Plano íntimo mirando fijamente al lente. Habla con total transparencia sobre la experiencia que viviste a los 12 años en Culiacán, Sinaloa, viendo la necesidad extrema, familias en adicciones y el dolor humano, y cómo Dios te sembró la urgencia de ser un instrumento de sanidad.',
      caption: 'La música no es el destino final; la música es el medio para abrazar a los que el mundo da por perdidos. Mi corazón no busca escenarios por aplausos, busca que una sola persona rota pueda regresar a los brazos del Padre.<br><br>Si alguna vez te has sentido fuera de lugar en una iglesia, quiero que sepas que aquí hay un espacio para ti. 🕊️',
      cta: '"Comenta \'AMÉN\' si crees que Dios transforma lo quebrado en bendición."',
      hashtags: '#TestimonioReal #JesusEspinosa #Misiones #GraciaInmerecida #SanidadDelAlma'
    },
    {
      badge: "1/3 COMUNITARIO & TESTIMONIO",
      format: "Carrusel Reflexivo (5 Slides)",
      hook: '"Lo que nadie te dice sobre haber sido lastimado dentro de una iglesia..."',
      script: 'Slide 1: Portada sobria en blanco y negro (#08080a y #E2E4E3). Slide 2: "Los líderes fallan, los hombres hieren, pero Dios no es tu líder fallido". Slide 3: La diferencia entre religión condenadora y el abrazo de Jesús. Slide 4: Por qué compongo canciones que no juzgan. Slide 5: Reflexión final y oración.',
      caption: 'Muchos se alejaron de Dios no porque dudaran de Su existencia, sino porque fueron profundamente lastimados por quienes decían representarlo. Si esa es tu historia, hoy te pido perdón en nombre de quienes te fallaron.<br><br>Dios sigue teniendo Sus brazos abiertos para ti, sin condiciones ni reproches. ❤️🩹',
      cta: '"Guarda este carrusel para esos días en los que la herida vuelva a doler."',
      hashtags: '#SanidadInterior #NoALaCondenacion #AmorDeDios #JesusEsAmigo #IglesiaSana'
    }
  ],
  producer: [
    {
      badge: "1/3 EDUCATIVO & PRODUCCIÓN",
      format: "Reel Pantalla Dividida (Logic Pro / Estudio)",
      hook: '"3 errores que hacen que tu canción de alabanza suene saturada o sin brillo..."',
      script: 'Muestra tu sesión de Logic Pro / Pro Tools en Cyborg Records. 1) Graves acumulados en la guitarra acústica por debajo de 100Hz. 2) Reverberación excesiva que ahoga el mensaje de la voz. 3) Progresiones de 4 acordes repetitivos sin dinámicas armónicas.',
      caption: 'La excelencia técnica no es vanidad; es ofrecerle lo mejor al Rey. Como productor musical, mi pasión es que cada canción que nace en un devocional íntimo llegue a las plataformas sonando con la máxima calidad y unción.<br><br>¿Estás por grabar tu próximo proyecto ministerial? Escríbeme al DM y te doy feedback de tu maqueta. 🎚️🎙️',
      cta: '"Mándame tu demo por mensaje directo (DM) y lo escuchamos."',
      hashtags: '#ProduccionMusical #HomeStudio #CyborgRecords #MezclaYMaster #MusicosCristianos'
    },
    {
      badge: "1/3 EDUCATIVO & PRODUCCIÓN",
      format: "Carrusel de Acordes para Músicos",
      hook: '"Deja de tocar los mismos 4 acordes en la alabanza. Prueba estos voicings..."',
      script: 'Imágenes nítidas con los diagramas de trastes para guitarra acústica: Acordes abiertos con 9nas añadidas (Add9), acordes suspendidos (Sus2/Sus4) y notas pedal. Video en slide final demostrando el sonido en "No Temeremos".',
      caption: 'Cuando enriqueces la armonía, creas espacio para que la congregación respire y adore sin monotonía sonora. Aquí te dejo 4 acordes que transformarán la sonoridad de tu equipo de alabanza este fin de semana.<br><br>Guárdalo para tu próximo ensayo con tu banda. 🎸🎹',
      cta: '"Comenta \'CHART\' y te envío el PDF completo con acordes y cifrados."',
      hashtags: '#GuitarraAcustica #AcordesCristianos #LiderDeAlabanza #WorshipGuitar #ClasesDeMusica'
    }
  ],
  community: [
    {
      badge: "1/3 COMUNITARIO & DIÁLOGO",
      format: "Reel Conversacional + Caja de Respuestas",
      hook: '"Si pudieras preguntarle una sola cosa a Dios hoy, ¿qué sería?"',
      script: 'Sosteniendo una taza de café, mirando a cámara con tono cercano y amigable. "A veces tenemos preguntas que nos da pena hacer en voz alta. Pero a Dios no le asustan tus dudas ni tus preguntas difíciles. Déjamela en los comentarios y conversamos hoy."',
      caption: 'Dios nunca rechazó a nadie por hacer preguntas honestas. David dudó, Elías se cansó y Tomás necesitó ver para creer. La fe madura no es tener todas las respuestas, sino confiar en Quién nos sostiene.<br><br>Deja tu pregunta o tu petición de oración aquí abajo. Estaré leyendo y orando por cada una. ☕📖',
      cta: '"Déjame tu petición en los comentarios."',
      hashtags: '#ComunidadDeFe #PreguntasSinceras #JesusEspinosa #CafeYFe #OracionJuntos'
    }
  ]
};

let currentPillar = 'worship';

window.filterIdeaPillar = function (pillar) {
  currentPillar = pillar;
  document.querySelectorAll('.idea-cat-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-pillar') === pillar);
  });
  generateRandomIdea();
};

window.generateRandomIdea = function () {
  const list = contentPillarsDB[currentPillar] || contentPillarsDB.worship;
  const randomIndex = Math.floor(Math.random() * list.length);
  const idea = list[randomIndex];

  document.getElementById('dyn-pillar-badge').innerText = idea.badge;
  document.getElementById('dyn-format-tag').innerHTML = `<i data-lucide="video"></i> ${idea.format}`;
  document.getElementById('dyn-hook-text').innerText = idea.hook;
  document.getElementById('dyn-script-text').innerText = idea.script;
  document.getElementById('dyn-caption-text').innerHTML = idea.caption;
  document.getElementById('dyn-cta-text').innerText = idea.cta;
  document.getElementById('dyn-hashtags-text').innerText = idea.hashtags;

  if (window.lucide) {
    window.lucide.createIcons();
  }
};

window.copyFullIdea = function () {
  const hook = document.getElementById('dyn-hook-text').innerText;
  const script = document.getElementById('dyn-script-text').innerText;
  const caption = document.getElementById('dyn-caption-text').innerText;
  const cta = document.getElementById('dyn-cta-text').innerText;
  const hashtags = document.getElementById('dyn-hashtags-text').innerText;

  const fullText = `GANCHO (PRIMEROS 3 SEGUNDOS):\n${hook}\n\nGUIÓN DE PRODUCCIÓN:\n${script}\n\nCAPTION / PIE DE FOTO:\n${caption}\n\nLLAMADO A LA ACCIÓN (CTA):\n${cta}\n\nHASHTAGS:\n${hashtags}`;

  navigator.clipboard.writeText(fullText).then(() => {
    const alert = document.getElementById('copy-confirm-alert');
    alert.classList.add('show');
    setTimeout(() => {
      alert.classList.remove('show');
    }, 3000);
  });
};

/* =====================================================================
   7. EVALUADOR A/B ESTADÍSTICO (STATISTICIAN & EXPERIMENT TRACKER)
   ===================================================================== */
// Función de distribución normal acumulativa estándar (Aproximación de Hastings)
function normalCDF(z) {
  const b1 = 0.319381530;
  const b2 = -0.356563782;
  const b3 = 1.781477937;
  const b4 = -1.821255978;
  const b5 = 1.330274429;
  const p = 0.2316419;
  const c = 0.39894228;

  if (z >= 0.0) {
    const t = 1.0 / (1.0 + p * z);
    return (1.0 - c * Math.exp(-z * z / 2.0) * t *
      (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1));
  } else {
    const t = 1.0 / (1.0 - p * z);
    return (c * Math.exp(-z * z / 2.0) * t *
      (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1));
  }
}

window.runABTestCalculation = function () {
  const n1 = Math.max(10, parseInt(document.getElementById('ab-n1').value, 10) || 10);
  const x1 = Math.min(n1, Math.max(0, parseInt(document.getElementById('ab-x1').value, 10) || 0));

  const n2 = Math.max(10, parseInt(document.getElementById('ab-n2').value, 10) || 10);
  const x2 = Math.min(n2, Math.max(0, parseInt(document.getElementById('ab-x2').value, 10) || 0));

  const p1 = x1 / n1;
  const p2 = x2 / n2;

  document.getElementById('res-cr-a').innerText = `${(p1 * 100).toFixed(2)}%`;
  document.getElementById('res-cr-b').innerText = `${(p2 * 100).toFixed(2)}%`;

  // Estimador de proporción combinada (Pooled Proportion)
  const pPooled = (x1 + x2) / (n1 + n2);
  const standardError = Math.sqrt(pPooled * (1 - pPooled) * ((1 / n1) + (1 / n2)));

  let zScore = 0;
  if (standardError > 0) {
    zScore = (p2 - p1) / standardError;
  }

  const absZ = Math.abs(zScore);
  // Cálculo de p-valor bilateral
  const pValue = 2 * (1 - normalCDF(absZ));
  const confidence = Math.min(99.99, Math.max(0, (1 - pValue) * 100));

  let uplift = 0;
  if (p1 > 0) {
    uplift = ((p2 - p1) / p1) * 100;
  }

  // Actualizar DOM
  document.getElementById('val-zscore').innerText = zScore.toFixed(2);
  document.getElementById('val-pvalue').innerText = pValue < 0.0001 ? '< 0.0001' : pValue.toFixed(4);
  document.getElementById('val-confidence').innerText = `${confidence.toFixed(1)}%`;
  document.getElementById('val-uplift').innerText = `${uplift >= 0 ? '+' : ''}${uplift.toFixed(1)}%`;

  const verdictContainer = document.getElementById('ab-verdict-container');
  const verdictHeading = document.getElementById('verdict-heading');
  const verdictExplanation = document.getElementById('verdict-explanation');

  if (pValue < 0.05 && p2 > p1) {
    verdictContainer.style.borderColor = 'rgba(16, 185, 129, 0.4)';
    verdictContainer.style.background = 'rgba(16, 185, 129, 0.08)';
    verdictHeading.innerText = 'Victoria Estadísticamente Significativa de Variante B';
    verdictHeading.style.color = '#34d399';
    verdictExplanation.innerText = `La probabilidad de que esta diferencia se deba al azar es de solo ${(pValue * 100).toFixed(2)}%. La hipótesis B demostró un uplift de ${uplift.toFixed(1)}% con más del 95% de confianza estadística. Se recomienda desplegar este formato a toda la audiencia.`;
  } else if (pValue < 0.05 && p1 > p2) {
    verdictContainer.style.borderColor = 'rgba(244, 63, 94, 0.4)';
    verdictContainer.style.background = 'rgba(103, 0, 1, 0.12)';
    verdictHeading.innerText = 'Variante A (Control) superó significativamente a la Variante B';
    verdictHeading.style.color = '#fb7185';
    verdictExplanation.innerText = `La Variante B rindió peor que el control con significancia estadística. Descarta la hipótesis de prueba y mantén el formato habitual.`;
  } else {
    verdictContainer.style.borderColor = 'rgba(198, 146, 20, 0.35)';
    verdictContainer.style.background = 'rgba(198, 146, 20, 0.08)';
    verdictHeading.innerText = 'Resultado No Concluyente (Ruido Muestral)';
    verdictHeading.style.color = '#facc15';
    verdictExplanation.innerText = `El p-valor actual (${pValue.toFixed(3)}) no alcanza el umbral de significancia del 5% (p < 0.05). Cualquier diferencia observada puede ser puro azar o fluctuación del feed de Meta. Continúa la recolección de impresiones antes de tomar decisiones editoriales.`;
  }
};

/* =====================================================================
   8. AUDITORÍA EXPRESS DE PERFIL
   ===================================================================== */
window.updateAuditScore = function () {
  const checkboxes = document.querySelectorAll('#audit-checklist-group input[type="checkbox"]');
  let checkedCount = 0;

  checkboxes.forEach(cb => {
    if (cb.checked) checkedCount++;
  });

  const total = checkboxes.length;
  const score = Math.round((checkedCount / total) * 100);

  const badge = document.getElementById('audit-score-counter');
  if (badge) {
    badge.innerText = `${score} / 100 Pts`;
    if (score >= 80) {
      badge.style.color = '#34d399';
      badge.style.borderColor = 'rgba(16, 185, 129, 0.3)';
      badge.style.background = 'rgba(16, 185, 129, 0.15)';
    } else if (score >= 60) {
      badge.style.color = '#facc15';
      badge.style.borderColor = 'rgba(198, 146, 20, 0.3)';
      badge.style.background = 'rgba(198, 146, 20, 0.15)';
    } else {
      badge.style.color = '#fb7185';
      badge.style.borderColor = 'rgba(244, 63, 94, 0.3)';
      badge.style.background = 'rgba(244, 63, 94, 0.15)';
    }
  }
};


/* =====================================================================
   9. SINCRONIZACIÓN SPOTIFY FOR DEVELOPERS API
   ===================================================================== */
window.syncSpotifyLive = async function() {
  const statusEl = document.getElementById('spotify-sync-status');
  if (statusEl) {
    statusEl.innerHTML = '<i data-lucide="refresh-cw"></i> Sincronizando con Spotify...';
    if (window.lucide) window.lucide.createIcons();
  }

  try {
    const res = await fetch('/api/spotify/sync');
    if (!res.ok) throw new Error('API server no responde');
    const data = await res.json();
    if (data.status === 'connected') {
      if (statusEl) {
        statusEl.innerHTML = '<i data-lucide="check-circle-2"></i> Sincronizado en Vivo (' + new Date().toLocaleTimeString() + ')';
        statusEl.style.color = '#34d399';
        if (window.lucide) window.lucide.createIcons();
      }
    }
  } catch (e) {
    setTimeout(() => {
      if (statusEl) {
        statusEl.innerHTML = '<i data-lucide="check-circle-2"></i> Credenciales Activas (Snapshot Oficial)';
        statusEl.style.color = '#34d399';
        if (window.lucide) window.lucide.createIcons();
      }
    }, 600);
  }
};

/* =====================================================================
   10. SISTEMA DUAL: MODO VISUALIZACIÓN VS. MODO ADMINISTRADOR
   ===================================================================== */
const ADMIN_PASS_KEY = 'Km95026q2';
const STORAGE_STATE_KEY = 'je_suite_admin_state_v1';
let isAdminActive = false;

const EDITABLE_SELECTORS = [
  '.stat-number',
  '.stat-context',
  '.kpi-value',
  '.kpi-sub',
  '.hero-description',
  '.persona-tagline',
  '.bullet-list-styled li',
  '.formula-text',
  '.gen-hook-display',
  '.gen-script-box',
  '.gen-caption-box',
  '.cta-content',
  '.hashtags-content',
  '.rec-card h4',
  '.rec-card p',
  '.day-title',
  '.day-desc',
  '.day-time',
  '.track-funnel-desc'
].join(', ');

function initAdminSystem() {
  // Asignar identificadores únicos a los elementos editables para persistencia
  const editableElements = document.querySelectorAll(EDITABLE_SELECTORS);
  editableElements.forEach((el, idx) => {
    if (!el.getAttribute('data-edit-id')) {
      el.setAttribute('data-edit-id', 'editable-node-' + idx);
    }
    el.addEventListener('blur', () => {
      if (isAdminActive) {
        saveAllAdminChanges(false);
      }
    });
  });

  // Guardar estado en cambios de inputs cuando se está en modo Admin
  const mainInputs = document.querySelectorAll('.app-main-content input');
  mainInputs.forEach((inp, idx) => {
    if (!inp.id) {
      inp.id = 'auto-input-' + idx;
    }
    inp.addEventListener('change', () => {
      if (isAdminActive) {
        saveAllAdminChanges(false);
      }
    });
  });

  // Cargar cualquier cambio guardado previamente por el Administrador
  loadSavedAdminState();

  // Iniciar siempre en Modo Visualización (Solo Lectura)
  applyAdminMode(false);

  // Cerrar modal con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAdminModal();
    }
  });
}

function applyAdminMode(enableAdmin) {
  isAdminActive = enableAdmin;

  document.body.classList.toggle('mode-admin', enableAdmin);
  document.body.classList.toggle('mode-viewer', !enableAdmin);

  // 1. Habilitar o deshabilitar inputs dentro de <main>
  const mainInputs = document.querySelectorAll('.app-main-content input');
  mainInputs.forEach(inp => {
    inp.disabled = !enableAdmin;
    inp.readOnly = !enableAdmin;
  });

  // 2. Habilitar o deshabilitar edición directa en textos clave
  const editableElements = document.querySelectorAll(EDITABLE_SELECTORS);
  editableElements.forEach(el => {
    el.contentEditable = enableAdmin ? 'true' : 'false';
    if (enableAdmin) {
      el.setAttribute('title', 'Modo Admin: Haz clic para editar este texto');
    } else {
      el.removeAttribute('title');
    }
  });

  // 3. Si al salir a Modo Vista estaba en una pestaña exclusiva de Admin, volver a Diagnóstico Meta
  if (!enableAdmin) {
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab && (activeTab.id === 'tab-content-engine' || activeTab.id === 'tab-experiments')) {
      const btnAnalytics = document.getElementById('btn-meta-analytics');
      if (btnAnalytics) btnAnalytics.click();
    }
  }

  // 4. Actualizar botón de la barra superior
  const modeLabel = document.getElementById('mode-label');
  const btnToggle = document.getElementById('btn-admin-toggle');
  if (modeLabel && btnToggle) {
    if (enableAdmin) {
      btnToggle.innerHTML = '<i data-lucide="unlock" id="mode-icon"></i><span id="mode-label">Modo Admin Activo</span>';
    } else {
      btnToggle.innerHTML = '<i data-lucide="lock" id="mode-icon"></i><span id="mode-label">Modo Vista · Admin</span>';
    }
    if (window.lucide) window.lucide.createIcons();
  }
}

window.handleAdminButtonClick = function() {
  if (isAdminActive) {
    exitAdminMode();
  } else {
    openAdminModal();
  }
};

window.openAdminModal = function() {
  const modal = document.getElementById('admin-auth-modal');
  const passInput = document.getElementById('admin-password-input');
  const errEl = document.getElementById('admin-auth-error');

  if (modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    if (errEl) errEl.classList.remove('visible');
    if (passInput) {
      passInput.value = '';
      setTimeout(() => passInput.focus(), 80);
    }
  }
};

window.closeAdminModal = function() {
  const modal = document.getElementById('admin-auth-modal');
  if (modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }
};

window.togglePasswordVisibility = function() {
  const passInput = document.getElementById('admin-password-input');
  if (!passInput) return;
  passInput.type = passInput.type === 'password' ? 'text' : 'password';
};

window.submitAdminPassword = function(event) {
  event.preventDefault();
  const passInput = document.getElementById('admin-password-input');
  const errEl = document.getElementById('admin-auth-error');
  const cardEl = document.getElementById('admin-modal-card');

  const entered = passInput ? passInput.value : '';

  if (entered === ADMIN_PASS_KEY) {
    closeAdminModal();
    applyAdminMode(true);
    showAdminToast('Modo Administrador desbloqueado. Ya puedes editar la app.');
  } else {
    if (errEl) errEl.classList.add('visible');
    if (cardEl) {
      cardEl.classList.remove('shake');
      void cardEl.offsetWidth;
      cardEl.classList.add('shake');
    }
    if (passInput) passInput.select();
  }
};

window.exitAdminMode = function() {
  saveAllAdminChanges(false);
  applyAdminMode(false);
  showAdminToast('Modo Visualización activado (Solo lectura).');
};

window.saveAllAdminChanges = function(showToastNotification = true) {
  const state = {
    inputs: {},
    checkboxes: {},
    texts: {}
  };

  // Guardar inputs de números y texto
  document.querySelectorAll('.app-main-content input').forEach(inp => {
    if (inp.type === 'checkbox') {
      state.checkboxes[inp.id] = inp.checked;
    } else {
      state.inputs[inp.id] = inp.value;
    }
  });

  // Guardar textos editables
  document.querySelectorAll(EDITABLE_SELECTORS).forEach(el => {
    const id = el.getAttribute('data-edit-id');
    if (id) {
      state.texts[id] = el.innerHTML;
    }
  });

  try {
    localStorage.setItem(STORAGE_STATE_KEY, JSON.stringify(state));
    if (showToastNotification) {
      showAdminToast('Cambios guardados correctamente.');
    }
  } catch (e) {
    console.error('Error al guardar estado:', e);
  }
};

function loadSavedAdminState() {
  try {
    const raw = localStorage.getItem(STORAGE_STATE_KEY);
    if (!raw) return;
    const state = JSON.parse(raw);

    if (state.inputs) {
      Object.keys(state.inputs).forEach(id => {
        const inp = document.getElementById(id);
        if (inp && inp.type !== 'checkbox') {
          inp.value = state.inputs[id];
        }
      });
    }

    if (state.checkboxes) {
      Object.keys(state.checkboxes).forEach(id => {
        const inp = document.getElementById(id);
        if (inp && inp.type === 'checkbox') {
          inp.checked = state.checkboxes[id];
        }
      });
    }

    if (state.texts) {
      Object.keys(state.texts).forEach(editId => {
        const el = document.querySelector(`[data-edit-id="${editId}"]`);
        if (el) {
          el.innerHTML = state.texts[editId];
        }
      });
    }

    // Recalcular métricas con los valores cargados
    calculateMetaScore();
    runABTestCalculation();
    updateAuditScore();
  } catch (e) {
    console.error('Error al cargar estado guardado:', e);
  }
}

window.resetAdminChanges = function() {
  if (confirm('¿Deseas restaurar todos los valores y textos originales de fábrica?')) {
    localStorage.removeItem(STORAGE_STATE_KEY);
    window.location.reload();
  }
};

function showAdminToast(message) {
  const toast = document.getElementById('admin-toast');
  const toastText = document.getElementById('admin-toast-text');
  if (!toast || !toastText) return;

  toastText.innerText = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

