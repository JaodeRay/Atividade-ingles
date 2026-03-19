/**
 * ============================================================
 * JAVASCRIPT – Site: Homenagem a Marie Curie / Marie Curie Tribute
 * Funcionalidades / Features:
 *   1. Alternância de idioma PT ↔ EN / Language toggle PT ↔ EN
 *   2. Upload e preview de imagens nos slots / Image upload & preview in slots
 *   3. Remoção de imagens dos slots / Remove images from slots
 *   4. Carrossel de frases / Quotes carousel
 *   5. Animações de entrada por scroll / Scroll entry animations
 *   6. Partículas de fundo animadas / Animated background particles
 *   7. Navbar com efeito de scroll / Navbar scroll effect
 * ============================================================
 */

/* ── ESTADO GLOBAL / GLOBAL STATE ── */

/**
 * Idioma atual da página.
 * 'pt' = Português (padrão) | 'en' = English
 * Current page language. 'pt' = Portuguese (default) | 'en' = English
 */
let currentLang = 'pt';

/**
 * Índice da frase atualmente exibida no carrossel.
 * Index of the currently displayed quote in the carousel.
 */
let currentQuoteIndex = 0;

/**
 * Total de slides no carrossel (calculado dinamicamente).
 * Total slides in the carousel (calculated dynamically).
 */
let totalQuotes = 0;

/* ════════════════════════════════════════════════════════════
   1. INICIALIZAÇÃO / INITIALIZATION
   Executado quando o DOM estiver completamente carregado.
   Runs when the DOM is fully loaded.
════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {

  // Inicializa as partículas de fundo / Initialize background particles
  initParticles();

  // Inicializa o carrossel de frases / Initialize quotes carousel
  initCarousel();

  // Inicializa as animações de scroll / Initialize scroll animations
  initScrollAnimations();

  // Inicializa o efeito de scroll na navbar / Initialize navbar scroll effect
  initNavbarScroll();

  // Adiciona classe de animacao aos elementos alvo / Add animation class to target elements
  addAnimationClasses();

  // Inicializa as imagens pre-carregadas / Initialize pre-loaded images
  initPreloadedImages();

  console.log('✅ Site Marie Curie carregado / Site loaded');
});

/* ════════════════════════════════════════════════════════════
   1.5. INICIALIZAR IMAGENS PRE-CARREGADAS / INITIALIZE PRE-LOADED IMAGES
════════════════════════════════════════════════════════════ */

/**
 * Inicializa as imagens pre-carregadas, ocultando os labels dos slots.
 * Initializes pre-loaded images, hiding slot labels.
 */
function initPreloadedImages() {

  // Lista de slots com imagens pre-carregadas / List of slots with pre-loaded images
  const slotsWithImages = [
    'hero-slot',
    'bio-slot',
    'lab-slot',
    'legacy-slot',
    'gal-slot-1',
    'gal-slot-2',
    'gal-slot-3',
    'gal-slot-4',
    'gal-slot-5',
    'gal-slot-6'
  ];

  slotsWithImages.forEach(function (slotId) {
    const slot = document.getElementById(slotId);
    if (!slot) return;

    // Obtem a imagem do slot / Get the image from the slot
    const img = slot.querySelector('img');
    if (!img || !img.src) return;

    // Oculta o label (instrucao de upload) / Hide the label (upload instruction)
    const label = slot.querySelector('.slot-label');
    if (label) {
      label.style.display = 'none';
    }
  });

  console.log('🖼️ Imagens pre-carregadas inicializadas / Pre-loaded images initialized');
}

/* ════════════════════════════════════════════════════════════
   2. ALTERNÂNCIA DE IDIOMA / LANGUAGE TOGGLE
════════════════════════════════════════════════════════════ */

/**
 * Alterna o idioma da página entre Português e Inglês.
 * Toggles the page language between Portuguese and English.
 *
 * Como funciona / How it works:
 * - Todos os elementos com atributos data-pt e data-en são atualizados.
 * - All elements with data-pt and data-en attributes are updated.
 */
function toggleLanguage() {

  // Alterna o idioma / Toggle language
  currentLang = currentLang === 'pt' ? 'en' : 'pt';

  // Atualiza o rótulo do botão / Update button label
  const langLabel = document.getElementById('lang-label');
  langLabel.textContent = currentLang === 'pt' ? 'EN' : 'PT';

  // Atualiza o atributo lang do HTML para acessibilidade / Update HTML lang for accessibility
  document.documentElement.lang = currentLang;

  // Seleciona todos os elementos com atributos de tradução / Select all elements with translation attributes
  const translatableElements = document.querySelectorAll('[data-pt][data-en]');

  translatableElements.forEach(function (element) {

    // Obtém o texto no idioma atual / Get text in current language
    const newText = element.getAttribute('data-' + currentLang);

    if (newText) {
      // Atualiza o conteúdo HTML (suporta entidades HTML como &ldquo;)
      // Updates HTML content (supports HTML entities like &ldquo;)
      element.innerHTML = newText;
    }
  });

  // Atualiza o título da página / Update page title
  if (currentLang === 'en') {
    document.title = 'Marie Curie – The Light of Science';
  } else {
    document.title = 'Marie Curie – A Luz da Ciência / The Light of Science';
  }

  console.log('🌐 Idioma alterado para / Language changed to:', currentLang.toUpperCase());
}

/* ════════════════════════════════════════════════════════════
   3. UPLOAD E PREVIEW DE IMAGENS / IMAGE UPLOAD & PREVIEW
════════════════════════════════════════════════════════════ */

/**
 * Carrega uma imagem selecionada pelo usuário em um slot específico.
 * Loads a user-selected image into a specific slot.
 *
 * @param {HTMLInputElement} input  - O input de arquivo / The file input
 * @param {string}           slotId - O ID do slot onde a imagem será exibida / The slot ID
 */
function loadImage(input, slotId) {

  // Verifica se um arquivo foi selecionado / Check if a file was selected
  if (!input.files || !input.files[0]) return;

  const file = input.files[0];

  // Verifica se o arquivo é uma imagem / Check if file is an image
  if (!file.type.startsWith('image/')) {
    alert(currentLang === 'pt'
      ? 'Por favor, selecione um arquivo de imagem válido.'
      : 'Please select a valid image file.');
    return;
  }

  // Cria um FileReader para ler o arquivo como URL de dados
  // Creates a FileReader to read the file as a data URL
  const reader = new FileReader();

  reader.onload = function (event) {

    const slot = document.getElementById(slotId);
    if (!slot) return;

    // Determina o ID da imagem baseado no ID do slot / Determine image ID based on slot ID
    // Convenção: slot ID 'bio-slot' → img ID 'bio-img'
    // Convention: slot ID 'bio-slot' → img ID 'bio-img'
    let imgId;

    if (slotId === 'hero-slot') {
      imgId = 'hero-img';
    } else if (slotId === 'bio-slot') {
      imgId = 'bio-img';
    } else if (slotId === 'lab-slot') {
      imgId = 'lab-img';
    } else if (slotId === 'legacy-slot') {
      imgId = 'legacy-img';
    } else if (slotId.startsWith('gal-slot-')) {
      // Extrai o número do slot da galeria / Extract gallery slot number
      const num = slotId.replace('gal-slot-', '');
      imgId = 'gal-img-' + num;
    }

    const img = document.getElementById(imgId);
    if (!img) return;

    // Define a fonte da imagem com os dados lidos / Set image source with read data
    img.src = event.target.result;
    img.style.display = 'block';

    // Oculta o label do slot (instrução de upload) / Hide slot label (upload instruction)
    const label = slot.querySelector('.slot-label');
    if (label) label.style.display = 'none';

    // Mostra o botão de remover (apenas para slots da galeria) / Show remove button (gallery slots only)
    const removeBtn = slot.querySelector('.remove-btn');
    if (removeBtn) removeBtn.style.display = 'flex';

    // Para o slot do hero, oculta o label de forma diferente / For hero slot, hide label differently
    if (slotId === 'hero-slot') {
      const heroLabel = slot.querySelector('.slot-label');
      if (heroLabel) heroLabel.style.opacity = '0';
    }

    // Adiciona efeito visual de sucesso / Add visual success effect
    slot.style.borderColor = 'var(--color-accent)';
    slot.style.boxShadow = 'var(--shadow-glow)';

    console.log('🖼️ Imagem carregada no slot / Image loaded in slot:', slotId);
  };

  // Inicia a leitura do arquivo / Start reading the file
  reader.readAsDataURL(file);
}

/**
 * Remove a imagem de um slot da galeria, restaurando o estado inicial.
 * Removes the image from a gallery slot, restoring the initial state.
 *
 * @param {string} slotId - O ID do slot a ser limpo / The slot ID to clear
 */
function removeImage(slotId) {

  // Impede que o clique no botão de remover abra o seletor de arquivo
  // Prevents the remove button click from opening the file selector
  event.stopPropagation();

  const slot = document.getElementById(slotId);
  if (!slot) return;

  // Extrai o número do slot / Extract slot number
  const num = slotId.replace('gal-slot-', '');
  const imgId = 'gal-img-' + num;
  const inputId = 'gal-upload-' + num;

  // Limpa a imagem / Clear the image
  const img = document.getElementById(imgId);
  if (img) {
    img.src = '';
    img.style.display = 'none';
  }

  // Reseta o input de arquivo / Reset file input
  const input = document.getElementById(inputId);
  if (input) input.value = '';

  // Mostra novamente o label / Show label again
  const label = slot.querySelector('.slot-label');
  if (label) label.style.display = 'flex';

  // Oculta o botão de remover / Hide remove button
  const removeBtn = slot.querySelector('.remove-btn');
  if (removeBtn) removeBtn.style.display = 'none';

  // Restaura o estilo da borda / Restore border style
  slot.style.borderColor = '';
  slot.style.boxShadow = '';

  console.log('🗑️ Imagem removida do slot / Image removed from slot:', slotId);
}

/* ════════════════════════════════════════════════════════════
   4. CARROSSEL DE FRASES / QUOTES CAROUSEL
════════════════════════════════════════════════════════════ */

/**
 * Inicializa o carrossel de frases.
 * Initializes the quotes carousel.
 */
function initCarousel() {

  // Obtém todos os slides / Get all slides
  const slides = document.querySelectorAll('.quote-slide');
  totalQuotes = slides.length;

  if (totalQuotes === 0) return;

  // Gera os pontos de navegação / Generate navigation dots
  const dotsContainer = document.getElementById('carousel-dots');
  if (dotsContainer) {
    for (let i = 0; i < totalQuotes; i++) {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.setAttribute('aria-label', 'Frase ' + (i + 1));
      if (i === 0) dot.classList.add('active'); // Primeiro ponto ativo / First dot active
      dot.addEventListener('click', function () {
        goToQuote(i); // Navega para o slide clicado / Navigate to clicked slide
      });
      dotsContainer.appendChild(dot);
    }
  }

  // Inicia a rotação automática a cada 6 segundos / Start auto-rotation every 6 seconds
  setInterval(function () {
    nextQuote();
  }, 6000);

  console.log('🎠 Carrossel iniciado com / Carousel started with', totalQuotes, 'frases/quotes');
}

/**
 * Avança para a próxima frase no carrossel.
 * Advances to the next quote in the carousel.
 */
function nextQuote() {
  const next = (currentQuoteIndex + 1) % totalQuotes;
  goToQuote(next);
}

/**
 * Volta para a frase anterior no carrossel.
 * Goes back to the previous quote in the carousel.
 */
function prevQuote() {
  const prev = (currentQuoteIndex - 1 + totalQuotes) % totalQuotes;
  goToQuote(prev);
}

/**
 * Navega para um slide específico do carrossel.
 * Navigates to a specific carousel slide.
 *
 * @param {number} index - O índice do slide destino / The target slide index
 */
function goToQuote(index) {

  const slides = document.querySelectorAll('.quote-slide');
  const dots   = document.querySelectorAll('.carousel-dot');

  // Remove a classe 'active' do slide atual / Remove 'active' from current slide
  if (slides[currentQuoteIndex]) {
    slides[currentQuoteIndex].classList.remove('active');
  }
  if (dots[currentQuoteIndex]) {
    dots[currentQuoteIndex].classList.remove('active');
  }

  // Atualiza o índice atual / Update current index
  currentQuoteIndex = index;

  // Adiciona 'active' ao novo slide / Add 'active' to new slide
  if (slides[currentQuoteIndex]) {
    slides[currentQuoteIndex].classList.add('active');
  }
  if (dots[currentQuoteIndex]) {
    dots[currentQuoteIndex].classList.add('active');
  }
}

/* ════════════════════════════════════════════════════════════
   5. ANIMAÇÕES DE ENTRADA POR SCROLL / SCROLL ENTRY ANIMATIONS
════════════════════════════════════════════════════════════ */

/**
 * Adiciona a classe 'animate-on-scroll' aos elementos que devem ser animados.
 * Adds the 'animate-on-scroll' class to elements that should be animated.
 */
function addAnimationClasses() {

  // Seletores dos elementos a animar / Selectors of elements to animate
  const selectors = [
    '.radio-card',
    '.legacy-card',
    '.timeline-item',
    '.stat-card',
    '.bio-text p',
    '.section-header'
  ];

  selectors.forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.classList.add('animate-on-scroll');
    });
  });
}

/**
 * Inicializa o Intersection Observer para animações de scroll.
 * Initializes the Intersection Observer for scroll animations.
 *
 * O Intersection Observer detecta quando um elemento entra na viewport.
 * The Intersection Observer detects when an element enters the viewport.
 */
function initScrollAnimations() {

  // Configuração do observer / Observer configuration
  const observerOptions = {
    threshold: 0.15,    // Elemento 15% visível para disparar / Element 15% visible to trigger
    rootMargin: '0px 0px -50px 0px' // Margem inferior negativa / Negative bottom margin
  };

  // Cria o observer / Create the observer
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Adiciona classe 'visible' para disparar a animação CSS / Add 'visible' class to trigger CSS animation
        entry.target.classList.add('visible');
        // Para de observar após animar (performance) / Stop observing after animation (performance)
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observa todos os elementos com a classe de animação / Observe all elements with animation class
  // (Usa um pequeno atraso para garantir que as classes foram adicionadas)
  // (Uses a small delay to ensure classes have been added)
  setTimeout(function () {
    document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
      observer.observe(el);
    });
  }, 100);

  console.log('👁️ Scroll animations initialized');
}

/* ════════════════════════════════════════════════════════════
   6. PARTÍCULAS DE FUNDO / BACKGROUND PARTICLES
════════════════════════════════════════════════════════════ */

/**
 * Cria e anima partículas flutuantes no fundo da página.
 * Creates and animates floating particles in the page background.
 *
 * Simula partículas radioativas / Simulates radioactive particles.
 */
function initParticles() {

  const container = document.getElementById('particles-container');
  if (!container) return;

  // Número de partículas / Number of particles
  const PARTICLE_COUNT = 30;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    createParticle(container);
  }

  console.log('✨ Particles initialized:', PARTICLE_COUNT);
}

/**
 * Cria uma única partícula com propriedades aleatórias.
 * Creates a single particle with random properties.
 *
 * @param {HTMLElement} container - O container das partículas / The particles container
 */
function createParticle(container) {

  const particle = document.createElement('div');
  particle.classList.add('particle');

  // Tamanho aleatório entre 2px e 6px / Random size between 2px and 6px
  const size = Math.random() * 4 + 2;
  particle.style.width  = size + 'px';
  particle.style.height = size + 'px';

  // Posição horizontal aleatória / Random horizontal position
  particle.style.left = Math.random() * 100 + '%';

  // Duração de animação aleatória entre 8s e 20s / Random animation duration 8s-20s
  const duration = Math.random() * 12 + 8;
  particle.style.animationDuration = duration + 's';

  // Atraso de animação aleatório / Random animation delay
  const delay = Math.random() * 10;
  particle.style.animationDelay = delay + 's';

  // Opacidade aleatória / Random opacity
  particle.style.opacity = Math.random() * 0.5 + 0.1;

  container.appendChild(particle);
}

/* ════════════════════════════════════════════════════════════
   7. EFEITO DE SCROLL NA NAVBAR / NAVBAR SCROLL EFFECT
════════════════════════════════════════════════════════════ */

/**
 * Adiciona um efeito visual à navbar quando o usuário rola a página.
 * Adds a visual effect to the navbar when the user scrolls the page.
 */
function initNavbarScroll() {

  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', function () {

    // Se o scroll for maior que 50px, adiciona a classe 'scrolled' / If scroll > 50px, add 'scrolled' class
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(10, 14, 10, 0.98)';
      navbar.style.borderBottomColor = 'var(--color-accent-dim)';
    } else {
      navbar.style.background = 'rgba(10, 14, 10, 0.92)';
      navbar.style.borderBottomColor = 'var(--color-border)';
    }
  });
}

/* ════════════════════════════════════════════════════════════
   8. UTILITÁRIOS / UTILITIES
════════════════════════════════════════════════════════════ */

/**
 * Rolagem suave para uma seção ao clicar nos links da navbar.
 * Smooth scroll to a section when clicking navbar links.
 * (O CSS já cuida disso com scroll-behavior: smooth, mas esta
 *  função pode ser usada para casos específicos)
 * (CSS already handles this with scroll-behavior: smooth, but
 *  this function can be used for specific cases)
 *
 * @param {string} sectionId - O ID da seção destino / The target section ID
 */
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ════════════════════════════════════════════════════════════
   FIM DO SCRIPT / END OF SCRIPT
   Marie Curie – "Nada na vida deve ser temido, somente compreendido."
   Marie Curie – "Nothing in life is to be feared, it is only to be understood."
════════════════════════════════════════════════════════════ */
