
//--------------------------------------------------------------------------------------------------------------------------------------------

const squares1 = document.querySelector('.square1');
const squares2 = document.querySelector('.square2');
const squares3 = document.querySelector('.square3');


setTimeout(() => {
    squares1.style.backgroundColor = '#e0e73f';
    squares2.style.backgroundColor = '#1f18c0';
    squares3.style.backgroundColor = '#1f18c0';
}, 300);

setTimeout(() => {
    squares1.style.backgroundColor = '#e0e73f';
    squares2.style.backgroundColor = '#e0e73f';
    squares3.style.backgroundColor = '#1f18c0';
}, 600);

setTimeout(() => {
    squares1.style.backgroundColor = '#e0e73f';
    squares2.style.backgroundColor = '#e0e73f';
    squares3.style.backgroundColor = '#e0e73f';
}, 900);

// Nascondi loader dopo 3.5 secondi
setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.style.opacity = '0';
    loader.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        loader.style.display = 'none';
    }, 300);
}, 1200);

mapboxgl.accessToken = 'pk.eyJ1IjoiZmFiaW9vY2Fwb25ldHRvIiwiYSI6ImNtOTFqNDAyeTAxNXgybnNmamw2NHZrbHAifQ.sKY-OeZ4eijHVkdjgg1vYQ';

const width = window.innerWidth;
const isMobileOrTablet = width <= 1024;

// Imposta centro e zoom in base al dispositivo
const centerCoords = isMobileOrTablet
? [12.0970 + 0.075, 45.53435 - 0.025] // spostamento leggero a destra e in alto
: [12.0970, 45.53435];

const zoomLevel = isMobileOrTablet ? 10 : 10.7;

//visualizzazione iniziale della mappa
const map = new mapboxgl.Map({
    container: 'map',
    minZoom: 9,
    zoom: zoomLevel,
    center: centerCoords,
    bearing: 0,
    style: 'mapbox://styles/mapbox/light-v11'
});

//controlla il video già mostrato
var currentVideoId = null;
var allFeatures = [];
var currentIndex = -1;

//--------------------------------------------------------------------------------------------------------------------------------------------

//creazione del contenuto dell'overlay dal file geojson e della visualizzazione del video
const card = document.getElementById('properties');
const showCard = (feature) => {
    const includedKeys = ['descrizione_breve', 'scopo_breve', 'posizione_breve', 'visitabile_breve', 'specie_più_presente']; // Chiavi da visualizzare

    //gestisco la visualizzazione dell'overlay
    card.innerHTML = `
        <div class="titolo_overlay"><code>${feature.properties.name}</code></div>
        <div class="descrizione">
            <div>
                ${includedKeys
                .map(key => `
                    <ul class="descr-item">
                        <code>${key.replace(/_/g, ' ').replace(' breve', '')}:<strong> ${feature.properties[key]}</strong></code>
                    </ul>
                `).join('')}
            </div>
            <div class="more-button"><code><u>scopri di più</u></code></div>
        </div>
        <div class="av-in">
            <img src="img/freccia indietro blu.svg" id="indietro">
            <img src="img/freccia avanti blu.svg" id="avanti">
        </div>`;

    card.style.display = 'block';

    //inserisco il contenuto dell'overlay
    document.querySelectorAll('.more-button').forEach(item => {
        item.addEventListener('click', async () => { // <-- funzione async qui!
    
            const nomebreveArea = feature.properties.abb_name; // valore da feature

            const overlay = document.createElement('div');
            overlay.classList.add('extra-overlay');
            overlay.innerHTML = `
                <div class="overlay-content">
                    <div class="header-descrizione">
                        <div class="titoletto"><code>${feature.properties.name}</code></div>
                        <img src="img/close_bianco.svg" id="close-overlay"></img>
                    </div>
                    <div class="descrizione-area"><code>${feature.properties.descrizione_area}</code></div>
                    <div class="button-scelta">
                        <div>
                            <button id="satellite-button"><code>SATELLITE</code></button>
                            <button id="acqua-button"><code>ACQUA</code></button>                        
                            <button id="flora-button"><code>FLORA</code></button>
                        </div>
                    </div>
                    <div class="image-container">
                        <div class="areatempo1"><p><code>${feature.properties.anno.split(',')[0].trim()}</code></p>
                            <img src="img/img_tot/${nomebreveArea} 1.png" id="areatempo1">
                        </div>
                        <div class="areatempo2"><p><code>${feature.properties.anno.split(',')[1].trim()}</code></p>
                            <img src="img/img_tot/${nomebreveArea} 2.png" id="areatempo2">
                        </div>
                        <div class="areatempo3"><p><code>${feature.properties.anno.split(',')[2].trim()}</code></p>
                            <img src="img/img_tot/${nomebreveArea} 3.png" id="areatempo3">
                        </div>
                        <div class="areatempo4"><p><code>${feature.properties.anno.split(',')[3].trim()}</code></p>
                            <img src="img/img_tot/${nomebreveArea} 4.png" id="areatempo4">
                        </div>
                    </div>
                    <div class="crediti-sat">
                        <a>© Google Earth - 2025</a>
                    </div>
                    <div class="curiosita">
                        <div class="grandezza"><div><code>■ </div><div> ${feature.properties.grandezza}</div></code></div>
                        <div class="posizione"><div><code>■ </div><div> ${feature.properties.posizione}</div></code></div>
                        <div class="testo-curiosita"><div><code>■ </div><div> ${feature.properties.curiosità}</div></code></div>
                    </div>
                    <div class="specie-area">
                        <div class="specie-presente">
                            <a id="specie-presente"><code>SPECIE PRESENTE</code></a>
                            <div class="info-specie">
                                <div id="img-specie-presente"><img src="${feature.properties.img_specie_più_presente}"></div>
                                <div id="testo-specie-presente">
                                    <code>
                                        <a style="text-transform: uppercase;"><strong>${feature.properties.specie_più_presente}</strong></a><br>
                                        <a style="color:gray">${feature.properties.scientifico_specie_più_presente}</a><br><br>
                                        ${feature.properties.descr_specie_più_presente}
                                    </code>
                                </div>
                            </div>
                        </div>
                        <div class="specie-reinserite">
                            <a id="specie-reinserite"><code>SPECIE REINSERITE</code></a>
                            <div id="elenco-specie-reinserite">
                                <div id="img-specie-reinserite">
                                    <img src="" alt=""/>
                                    <div id="preview-next-specie">
                                        <img src="" alt="Anteprima specie successiva" id="next-specie-preview" />
                                    </div>
                                </div>
                                <div id="testo-specie-reinserite"></div>
                            </div>
                            <div class="freccie-specie">
                                <img src="img/freccia avanti blu.svg" id="avanti-specie">
                            </div>
                        </div>
                    </div>
                    <div id="immagini-osservazioni">
                        <div class="titolo-osservazioni">
                            <div>
                                <a id="osservazioni-area">
                                    <code>OSSERVAZIONI iNATURALIST EFFETTUATE NELL'AREA</code>
                                </a>
                            </div>
                            <div class="crediti-inat">
                                <a>© iNaturalist - 2025 | Immagini scattate dalle persone all'interno dell'area naturale "${feature.properties.name}"</a>
                            </div>
                        </div>
                        <div id="box-immagini"></div>
                        <div id="tooltip-img"></div>
                    </div>
                </div> 
                `;


                const mapContainer = document.querySelector('.map-container');
                mapContainer.appendChild(overlay);
                setTimeout(() => {
                    overlay.classList.add('show');
                }, 10);
                
                const specieReinserite = feature.properties.specie_reinserite;
                const elencoSpecie = overlay.querySelector('#elenco-specie-reinserite');
                
                if (specieReinserite && elencoSpecie) {
                    const nomiSpecie = specieReinserite.split(',').map(s => s.trim().toLowerCase());
                    const response = await fetch('data/specie_reinserite.csv');
                    const text = await response.text();
                    const righe = text.trim().split('\n').slice(1); // Salta intestazione
                
                    const specieTrovate = [];
                
                    righe.forEach(riga => {
                        const [specie, scientifico_specie, descrizione, url] = riga.split(',');
                        const specieTrim = specie.trim().toLowerCase();
                
                        if (nomiSpecie.includes(specieTrim)) {
                            specieTrovate.push({
                                nome: specie.trim(),
                                scientifico: scientifico_specie.trim(),
                                descrizione: descrizione.trim(),
                                url: url.trim()
                            });
                        }
                    });
                
                    let currentIndex = 0;
                    const imgDiv = overlay.querySelector('#img-specie-reinserite img');
                    const testoDiv = overlay.querySelector('#testo-specie-reinserite');
                    const nextPreviewImg = overlay.querySelector('#next-specie-preview');
                
                    function mostraSpecie(index) {
                        const specie = specieTrovate[index];
                        if (!specie) return;
                
                        imgDiv.src = specie.url;
                        imgDiv.alt = specie.nome;
                        testoDiv.innerHTML = `
                            <code>
                                <a style="text-transform: uppercase;"><strong>${specie.nome}</strong></a><br>
                                <a style="color:gray">${specie.scientifico}</a>
                                <br><br>
                                ${specie.descrizione}
                            </code>
                        `;
                
                        // Mostra l'anteprima della specie successiva, se disponibile
                        const nextSpecie = specieTrovate[(index + 1) % specieTrovate.length];
                        nextPreviewImg.src = nextSpecie ? nextSpecie.url : ''; // Imposta l'anteprima
                    }
                
                    mostraSpecie(currentIndex);
                
                    overlay.querySelector('#avanti-specie').addEventListener('click', () => {
                        currentIndex = (currentIndex + 1) % specieTrovate.length;
                        mostraSpecie(currentIndex);
                    });

                    document.querySelector('#avanti-specie').addEventListener('mouseenter', () => {
                        document.querySelector('#avanti-specie').style.backgroundColor = '#1f18c0';
                        document.querySelector('#avanti-specie').setAttribute("src","img/freccia avanti bianca.svg");
                    });

                    document.querySelector('#avanti-specie').addEventListener('mouseleave', () => {
                        document.querySelector('#avanti-specie').style.backgroundColor = '#f7f7f7';
                        document.querySelector('#avanti-specie').setAttribute("src","img/freccia avanti blu.svg");
                    });
                }
                             

            async function caricaDatiCSV() {
                const response = await fetch('data/iNaturalist_aree.csv');
                const data = await response.text();
              
                const righe = data.trim().split('\n').slice(1);
                const immagini = righe.map(riga => {
                  const [
                    id, immagine, data_avvistamento, image_url, latitude,
                    longitude, nome_classe, nome_scientifico, nome_comune,
                    nome_famiglia, luogo, nome_breve
                  ] = riga.split(',');
              
                  return {
                    id, immagine, data_avvistamento, image_url, latitude, longitude,
                    nome_classe, nome_scientifico, nome_comune,
                    nome_famiglia, luogo, nome_breve
                  };
                });
      
                  // Filtra solo per un certo luogo (es. "AREA UMIDA COMUNETTO")
                  const filtrate = immagini.filter(img =>
                      img.luogo && img.luogo.trim().toUpperCase() === feature.properties.name
                  );
      
                  // Mescola le immagini
                  filtrate.sort(() => Math.random() - 0.5);
      
                  return filtrate;

              }
              
              async function creaGriglia() {
                const immagini = await caricaDatiCSV();
              
                const gruppi = {};
                immagini.forEach(img => {
                  if (!img.image_url || !img.nome_classe) return;
                  if (!gruppi[img.nome_classe]) gruppi[img.nome_classe] = [];
                  gruppi[img.nome_classe].push(img.image_url);
                });
              
                renderGrid(gruppi, immagini);
              }
              
            function renderGrid(groups, tutteLeImmagini) {
                const container = document.getElementById('box-immagini');
                const numeroClassi = Object.keys(groups).length;
                const larghezzaColonna = 100 / numeroClassi + "%";

                const isMobile = width <= 950

                container.style.display = 'flex';
                container.style.justifyContent = 'flex-start';
                container.style.width = '100%';
                container.style.border = '1px solid black';
                container.style.marginTop = '2%';
                container.style.marginBottom = '4%';

                if (isMobile) {
                    container.style.flexWrap = 'wrap';
                    container.style.marginBottom = '10%';
                    container.style.border = 'none';

                    // Bottoni di filtro
                    const pulsantiContainer = document.createElement('div');
                    pulsantiContainer.style.display = 'flex';
                    pulsantiContainer.style.flexWrap = 'wrap';
                    pulsantiContainer.style.gap = '8px';
                    pulsantiContainer.style.marginTop = '8px';
                    pulsantiContainer.style.marginBottom = '10px';
                    pulsantiContainer.style.width = '100%';

                    const mostraTuttoBtn = document.createElement('button');
                    mostraTuttoBtn.id = 'mostra-tutto-btn';
                    mostraTuttoBtn.innerHTML = '<code style="text-transform: uppercase; font-size: x-small">Mostra tutti</code>';
                    mostraTuttoBtn.style.padding = '6px';
                    mostraTuttoBtn.style.lineHeight = '1.2';
                    mostraTuttoBtn.style.display = 'flex';
                    mostraTuttoBtn.style.alignItems = 'center';
                    mostraTuttoBtn.style.justifyContent = 'center';
                    mostraTuttoBtn.style.cursor = 'pointer';
                    mostraTuttoBtn.addEventListener('click', () => {
                        document.querySelectorAll('#box-immagini img').forEach(img => {
                            img.style.opacity = '1';
                        });

                        // Evidenzia il bottone "Mostra tutti"
                        mostraTuttoBtn.style.backgroundColor = '#1f18c0';
                        mostraTuttoBtn.style.color = '#f7f7f7';

                        // Resetta lo stile degli altri bottoni
                        document.querySelectorAll('#btn-specie').forEach(btn => {
                            btn.style.backgroundColor = 'transparent';
                            btn.style.color = 'black';
                        });
                    });
                    pulsantiContainer.appendChild(mostraTuttoBtn);

                    Object.entries(groups).forEach(([classe, images]) => {
                        const btn = document.createElement('button');
                        btn.innerHTML = `<code style="text-transform: uppercase;">${classe} (${images.length})</code>`;
                        btn.id = 'btn-specie';
                        btn.style.fontSize = 'x-small';
                        btn.style.lineHeight = '1.2';
                        btn.style.padding = '6px';
                        btn.style.cursor = 'pointer';
                        btn.style.display = 'flex';
                        btn.style.alignItems = 'center';
                        btn.style.justifyContent = 'center';
                        btn.style.cursor = 'pointer';
                        btn.addEventListener('click', () => {
                            document.querySelectorAll('#box-immagini img').forEach(img => {
                                img.style.opacity = img.alt === classe ? '1' : '0.2';
                                img.style.pointerEvents = img.alt === classe ? 'all' : 'none';
                            });

                            // Resetta lo stile degli altri bottoni
                            document.querySelectorAll('#btn-specie').forEach(btn => {
                                btn.style.backgroundColor = 'transparent';
                                btn.style.color = 'black';
                            });

                            // Evidenzia il bottone "Mostra tutti"
                            btn.style.backgroundColor = '#1f18c0';
                            btn.style.color = '#f7f7f7';

                            // Resetta lo stile degli altri bottoni
                            document.querySelectorAll('#mostra-tutto-btn').forEach(btn => {
                                btn.style.backgroundColor = 'transparent';
                                btn.style.color = 'black';
                            });
                        });
                        pulsantiContainer.appendChild(btn);
                    });

                    container.appendChild(pulsantiContainer);

                    // Griglia unica con tutte le immagini
                    tutteLeImmagini.forEach(imgData => {
                        if (!imgData.image_url || !imgData.nome_classe) return;

                        const img = document.createElement('img');
                        img.src = imgData.image_url;
                        img.alt = imgData.nome_classe;
                        img.style.width = '60px';
                        img.style.height = '60px';
                        img.style.objectFit = 'cover';
                        img.style.margin = '4px';

                        container.appendChild(img);

                        img.addEventListener('click', (event) => {
                            event.stopPropagation(); // evita che il click venga propagato al document

                            const tooltip = document.getElementById('tooltip-img');
                            tooltip.innerHTML = `
                                <img src="${imgData.image_url}" alt="">
                                <div class="info">
                                    <span><strong>${imgData.nome_comune}</strong></span>
                                    <span>${imgData.data_avvistamento}</span>
                                </div>
                            `;

                            tooltip.style.display = 'block';
                            tooltip.style.position = 'absolute';

                            const overlay = document.querySelector('.extra-overlay');
                            const offsetX = 18;
                            const offsetY = 60;
                            const left = overlay.clientWidth - tooltip.offsetWidth - offsetX;
                            const top = overlay.clientHeight - tooltip.offsetHeight - offsetY;

                            tooltip.style.left = `${left}px`;
                            tooltip.style.top = `${top}px`;

                            // 🔽 Aggiungi questo solo una volta
                            if (!tooltip.dataset.listener) {
                                document.addEventListener('click', (e) => {
                                    if (!tooltip.contains(e.target)) {
                                        tooltip.style.display = 'none';
                                    }
                                });
                                tooltip.dataset.listener = 'true'; // evita di aggiungere più listener
                            }
                        });

                        container.appendChild(img);

                    });



                    return;
                    //metti tanti bottoni quanto il numeroClassi e scrive nome_classe(quantità)
                    //metti un bottone che le mostra tutte
                    //metti tutte le foto in griglia una accanto all'altra all'interno del container, ogni foto deve avere grandezza 60x60px
                    //quando clicco su uno dei bottoni mi fa vedere solo le specie selezionate, le altre me le opacizza
                    //quando clicco su mostra tutto me le torna a far vedere tutte
                    //non andare avanti nella funzione
                }

                Object.entries(groups).forEach(([classe, images], index, array) => {
                    const colonna = document.createElement('div');
                    colonna.style.display = 'flex';
                    colonna.style.width = larghezzaColonna;
                    colonna.style.flexDirection = 'column';
                    colonna.style.padding = '1%';

                    if (index < array.length - 1) {
                        colonna.style.borderRight = '1px solid black';
                    }

                    const label = document.createElement('div');
                    label.innerHTML = `<code>${classe.toUpperCase()} (${images.length})</code>`;
                    label.style.marginBottom = '10px';
                    label.style.fontSize = isMobile ? '7px' : 'medium';

                    const griglia = document.createElement('div');
                    griglia.style.display = 'flex';
                    griglia.style.flexWrap = 'wrap';
                    griglia.style.gap = '10px';
                    griglia.style.width = '100%';
                    griglia.style.justifyContent = 'flex-start';

                    images.forEach((url, i) => {
                        const img = document.createElement('img');
                        img.src = url;
                        img.alt = classe;
                        img.style.flex = '0 1 90px';
                        img.style.maxWidth = '90px';
                        img.style.aspectRatio = '1';
                        img.style.objectFit = 'cover';

                        const immagineInfo = tutteLeImmagini.find(imgData => imgData.image_url === url);

                        img.addEventListener('mouseover', () => {
                            if (!immagineInfo) return;

                            const tooltip = document.getElementById('tooltip-img');
                            tooltip.innerHTML = `
                                <img src="${immagineInfo.image_url}" alt="">
                                <div class="info">
                                    <span><strong>${immagineInfo.nome_comune}</strong></span>
                                    <span>${immagineInfo.data_avvistamento}</span>
                                </div>
                            `;

                            tooltip.style.display = 'block';
                            tooltip.style.position = 'absolute';

                            const overlay = document.querySelector('.extra-overlay');
                            const overlayRect = overlay.getBoundingClientRect();
                            const imgRect = img.getBoundingClientRect();
                            const tooltipRect = tooltip.getBoundingClientRect();

                                // Posizione intelligente su desktop
                                let left = imgRect.left - overlayRect.left - 1;
                                let top = imgRect.top - overlayRect.top - 1;

                                const sbordaOrizzontalmente = left + tooltipRect.width + 100 > overlay.clientWidth;
                                const sbordaVerticalmente = top + tooltipRect.height + 100 > overlay.clientHeight;

                                if (sbordaOrizzontalmente) {
                                    left = imgRect.left + overlayRect.left - tooltipRect.width + 3;
                                    top = imgRect.top - overlayRect.top - 1;
                                } else if (sbordaVerticalmente) {
                                    left = imgRect.left - overlayRect.left - 1;
                                    top = imgRect.top - overlayRect.top - tooltipRect.height + imgRect.height;
                                }

                                if (sbordaOrizzontalmente && sbordaVerticalmente) {
                                    left = imgRect.left + overlayRect.left - tooltipRect.width + 3;
                                    top = imgRect.top - overlayRect.top - tooltipRect.height + imgRect.height;
                                }

                                tooltip.style.left = `${left}px`;
                                tooltip.style.top = `${top}px`;
                            
                        });

                        img.addEventListener('mouseleave', () => {
                            const tooltip = document.getElementById('tooltip-img');
                            tooltip.style.display = 'none';
                        });

                        griglia.appendChild(img);
                    });

                    colonna.appendChild(label);
                    colonna.appendChild(griglia);
                    container.appendChild(colonna);
                });
            }
              
            creaGriglia();
                  
            // Mostra iniziale della prima immagine
            document.querySelector('#areatempo1').style.opacity = '1';
            document.querySelector('#areatempo1').style.display = 'block';
            document.querySelector('#areatempo2').style.opacity = '1';
            document.querySelector('#areatempo2').style.display = 'block';
            document.querySelector('#areatempo3').style.opacity = '1';
            document.querySelector('#areatempo3').style.display = 'block';
            document.querySelector('#areatempo4').style.opacity = '1';
            document.querySelector('#areatempo4').style.display = 'block';

            const buttons = {
                satellite: {
                    button: document.querySelector('#satellite-button'),
                    color: { bg: 'rgb(0,0,0)', text: 'rgb(255,255,255)' },
                    suffix: '',
                    hoverBg: 'black',
                    hoverColor: '#f7f7f7'
                },
                acqua: {
                    button: document.querySelector('#acqua-button'),
                    color: { bg: '#1f18c0', text: '#f7f7f7' },
                    suffix: ' acqua',
                    hoverBg: '#1f18c0',
                    hoverColor: '#f7f7f7'
                },
                flora: {
                    button: document.querySelector('#flora-button'),
                    color: { bg: '#e0e73f', text: 'black' },
                    suffix: ' flora',
                    hoverBg: '#e0e73f',
                    hoverColor: 'black'
                }
            };

            // Attiva lo stile iniziale per il bottone "satellite"
            buttons.satellite.button.style.backgroundColor = buttons.satellite.color.bg;
            buttons.satellite.button.style.color = buttons.satellite.color.text;
            document.querySelector('#testo-hover').style.backgroundColor = buttons.satellite.hoverBg;
            document.querySelector('#testo-hover').style.color = buttons.satellite.hoverColor;

            const testoHover = document.querySelector('#testo-hover');
            const aree = [1, 2, 3, 4];
            const areaDivs = aree.map(i => document.querySelector(`.areatempo${i}`));
            const areaImgs = aree.map(i => document.querySelector(`#areatempo${i}`));

            // Funzione per aggiornare immagini
            function aggiornaImmagini(suffix = '') {
                aree.forEach(i => {
                    document.querySelector(`#areatempo${i}`).setAttribute("src", `img/img_tot/${nomebreveArea} ${i}${suffix}.png`);
                });
            }

            // Funzione per aggiornare colori dei bottoni
            function aggiornaColori(bottoneAttivo) {
                Object.entries(buttons).forEach(([nome, dati]) => {
                    const { button, color } = dati;
                    const isActive = nome === bottoneAttivo;
                    button.style.backgroundColor = isActive ? color.bg : 'transparent';
                    button.style.color = isActive ? color.text : 'black';
                });

                testoHover.style.backgroundColor = buttons[bottoneAttivo].hoverBg;
                testoHover.style.color = buttons[bottoneAttivo].hoverColor;
            }

            // Gestione click sui bottoni
            Object.entries(buttons).forEach(([nome, dati]) => {
                dati.button.addEventListener('click', () => {
                    vizSatellite = nome === 'satellite';
                    vizAcqua = nome === 'acqua';
                    vizFlora = nome === 'flora';

                    aggiornaImmagini(dati.suffix);
                    aggiornaColori(nome);
                });
            });

            // Hover sulle aree
            areaDivs.forEach((areaDiv, index) => {
                const i = index + 1;

                areaDiv.addEventListener('mouseenter', () => {
                    testoHover.style.display = 'block';
                    testoHover.innerHTML = `<code>${feature.properties.anno.split(',')[index].trim()}</code>`;

                    // Nasconde il paragrafo all'interno dell'area corrispondente
                    const paragraph = areaDiv.querySelector('p');
                    if (paragraph) paragraph.style.display = 'none';
                });

                areaDiv.addEventListener('mousemove', (e) => {
                    testoHover.style.left = `${e.pageX + 10}px`;
                    testoHover.style.top = `${e.pageY + 10}px`;
                });

                areaDiv.addEventListener('mouseleave', () => {
                    testoHover.style.display = 'none';

                    // Nasconde il paragrafo all'interno dell'area corrispondente
                    const paragraph = areaDiv.querySelector('p');
                    if (paragraph) paragraph.style.display = 'block';

                });
            });

            document.getElementById('close-overlay').addEventListener('click', () => {
                overlay.remove(); // rimuove solo dopo che la transizione è finita
            });

            document.getElementById('close-overlay').addEventListener('mouseenter', () => {
                document.getElementById('close-overlay').style.transitionr = ('0.2s');
                document.getElementById('close-overlay').setAttribute("src", "img/close_nero.svg");
                document.getElementById('close-overlay').style.backgroundColor = ('#e0e73f');
            });

            document.getElementById('close-overlay').addEventListener('mouseleave', () => {
                document.getElementById('close-overlay').setAttribute("src", "img/close_bianco.svg");
                document.getElementById('close-overlay').style.backgroundColor = ('transparent');
            });

        });

    });

    const avantiBtn = document.getElementById('avanti');
    const indietroBtn = document.getElementById('indietro');

    if (avantiBtn) {
        avantiBtn.addEventListener("mouseenter", () => {
            avantiBtn.src = "img/freccia avanti bianca.svg";
        });
        avantiBtn.addEventListener("mouseleave", () => {
            avantiBtn.src = "img/freccia avanti blu.svg";
        });

        avantiBtn.addEventListener('click', () => {
            map.setFilter('places', null);

            if (allFeatures.length === 0) return;
            currentIndex = (currentIndex + 1) % allFeatures.length; // cicla
            const nextFeature = allFeatures[currentIndex];

            showCard(nextFeature);

            //nascondi solo il places del video mostrato
            map.setFilter('places', ['!=', ['get', 'video'], nextFeature.properties.video]);

        });
    }

    if (indietroBtn) {
        indietroBtn.addEventListener("mouseenter", () => {
            indietroBtn.src = "img/freccia indietro bianca.svg";
        });
        indietroBtn.addEventListener("mouseleave", () => {
            indietroBtn.src = "img/freccia indietro blu.svg";
        });

        indietroBtn.addEventListener('click', () => {
            //ripristina la presenza di tutti i places
            map.setFilter('places', null);

            if (allFeatures.length === 0) return;
            currentIndex = (currentIndex - 1 + allFeatures.length) % allFeatures.length; // cicla
            const prevFeature = allFeatures[currentIndex];
            showCard(prevFeature);

            //nascondi solo il places del video mostrato
            map.setFilter('places', ['!=', ['get', 'video'], prevFeature.properties.video]);
        });
    }

    function getOffset(width) {
        if (width <= 768) return [0, 150];               // Mobile verticale
        if (width <= 950) return [-100, -20];            // Mobile orizzontale
        if (width <= 1024) return [0, 200];              // Tablet
        if (width <= 1400) return [0, -20];              // Desktop piccolo
        return [0, 0];                                   // Desktop grande
    }




    // Coordinate dal GeoJSON
    const coords = feature.geometry.coordinates; // [lng, lat]
    const centerCoords = feature.properties.center.split(',').map(Number); // [lng, lat]
    const zoomLevel = feature.properties.zoom;

    const width = window.innerWidth;

    // Controllo dispositivi
    const isMobileVert = width <= 768;
    const isMobileOriz = width <= 950 && width > 768;
    const isTablet = width <= 1024 && width > 950;
    const isDesktop = width > 1024;

    // Se sei su mobileOriz (ma non tablet e non desktop) → usa centerCoords
    const useCenteredCoords = isMobileOriz || isDesktop;

    // Se sei su mobile (orizzontale o verticale) → zoom ridotto
    const reduceZoom = isMobileOriz || isMobileVert;

    // Coord. da usare
    const flyToCoords = useCenteredCoords ? centerCoords : coords;

    // Zoom adattato
    const adjustedZoom = reduceZoom ? zoomLevel - 1 : zoomLevel;

    let offset;

    if (width <= 768) {
        // Mobile verticale
        offset = [0, 125];
    } else if (width <= 950) {
        // Mobile orizzontale
        offset = [-100, -20];
    } else if (width <= 1024) {
        // Tablet
        offset = [0, 200];
    } else if (width <= 1400) {
        // Desktop piccolo
        offset = [0, -20];
    } else {
        // Desktop grande
        offset = [0, 0];
    }

    // FlyTo
    map.flyTo({
        center: flyToCoords,
        zoom: adjustedZoom,
        offset: offset,
        speed: 1.8,
        curve: 1.4,
        essential: true
    });

    // Costruisci dinamicamente gli ID
    const sourceId = feature.properties.video;
    const videoUrl = `videos/${sourceId}.mp4`;

    // Coordinate in ordine: NO, NE, SE, SO
    const toLngLat = (str) => str.split(',').map(Number);
    const coordinates = [
        toLngLat(feature.properties.no),
        toLngLat(feature.properties.ne),
        toLngLat(feature.properties.se),
        toLngLat(feature.properties.so)
    ];

    // Rimuovi tutti i video precedenti
    allFeatures.forEach(f => {
        const sourceId = f.properties.video;
        if (map.getLayer(sourceId)) {
            map.removeLayer(sourceId);
        }
        if (map.getSource(sourceId)) {
            map.removeSource(sourceId);
        }
    });

    // Aggiungi nuovo source video
    map.addSource(sourceId, {
        type: 'video',
        urls: [videoUrl],
        coordinates: coordinates
    });

    map.addLayer({
        id: sourceId,
        type: 'raster',
        source: sourceId,
    });

    const tooltip = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    const hoverAreaId = `${feature.properties.video}-hover-area`;
        if (map.getLayer(hoverAreaId)) {
            map.removeLayer(hoverAreaId);
        }
        if (map.getSource(hoverAreaId)) {
            map.removeSource(hoverAreaId);
        }
    
        map.addLayer({
        id: hoverAreaId,
        type: 'fill',
        source: {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [[
                        toLngLat(feature.properties.no),
                        toLngLat(feature.properties.ne),
                        toLngLat(feature.properties.se),
                        toLngLat(feature.properties.so),
                        toLngLat(feature.properties.no)
                    ]]
                },
                    properties: {
                    name: feature.properties.name
                }
            }
        },
        paint: {
            'fill-opacity': 0
        }
    });
        
    map.on('mouseenter', `${sourceId}-hover-area`, (e) => {
        map.getCanvas().style.cursor = 'pointer';

        // Coordinate del centro, tipo "12.3456,45.6789"
        const centerCoords = feature.geometry.coordinates.map(Number);

        tooltip.setLngLat(centerCoords)
            .setHTML(`<code>${e.features[0].properties.name}</code>`)
            .addTo(map);
    });

    map.on('mouseleave', `${sourceId}-hover-area`, () => {
        map.getCanvas().style.cursor = '';
        tooltip.remove();
    });


    currentVideoId = sourceId;

    // Ripristina il testo del pulsante
    document.getElementById('mostra-video').innerHTML = '<code>MOSTRA VIDEO</code>';
    document.getElementById('mostra-video').style.backgroundColor = 'rgb(31,24,192)';
    document.getElementById('mostra-video').style.color = 'rgb(255,255,255)';
    document.getElementById('mostra-video').addEventListener('mouseenter', function() {
            this.style.color = 'rgb(255,255,255)';
            this.style.backgroundColor = 'rgb(0,0,0)';
        });
        document.getElementById('mostra-video').addEventListener('mouseleave', function() {
            this.style.color = 'rgb(255,255,255)';
            this.style.backgroundColor = 'rgb(31,24,192)';
        });


    allVideosVisible = false;
};

//--------------------------------------------------------------------------------------------------------------------------------------------


map.loadImage('img/rett.png', (error, image) => {
    if (error) throw error;
    map.addImage('square-icon', image);
});

map.loadImage('img/rett_hover.png', (error, image) => {
    if (error) throw error;
    map.addImage('square-icon-hover', image);
});

//--------------------------------------------------------------------------------------------------------------------------------------------


//quando la mappa si carica....
map.on('load', () => {
    //inserisci il confine del consorzio
    map.addSource('area_consorzio', {
        'type': 'geojson',
        'data': 'data/AR_Confine.geojson'
    });

    map.addLayer({
        'id': 'area_consorzio_traccia',
        'type': 'line',
        'slot': 'middle',
        'source': 'area_consorzio',
        'layout': {},
        'paint': {
            'line-color': 'rgba(31,24,192,1)',
        }
    });


    //inserisci i point nella mappa
    map.addSource('places', {
        type: 'geojson',
        data: 'data/Aree Consorzio.geojson', // Questo è il link al tuo file GeoJSON
        generateId: true
    });

    //fai vedere i point nella mappa
    map.addLayer({
        id: 'places',
        type: 'symbol',
        source: 'places',
        layout: {
            'icon-image': 'square-icon',
            'icon-size': 0.4,
            'icon-allow-overlap': true
        },
    });

    //aggiungi il layer quando stai passando sopra il punto
    map.addLayer({
        id: 'places-hover',
        type: 'symbol',
        source: 'places',
        layout: {
            'icon-image': 'square-icon-hover',
            'icon-size': 0.4,
            'icon-allow-overlap': true
        },
        filter: ['==', '_id', ''] // nessun punto visibile all'inizio
    });

    //per rimuovere l'etichette delle vie e delle attività commerciali
    const layersToRemove = [
        'road-label-simple',
        'poi-label'
    ];

    layersToRemove.forEach(layerId => {
        if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
        }
    });

    //click su un rettangolo places
    let selectedFeature = null;
    map.addInteraction('click', {
        type: 'click',
        target: { layerId: 'places' },
        handler: ({ feature }) => {
            if (selectedFeature) {
                map.setFeatureState(selectedFeature, { selected: false });
            }

            selectedFeature = feature;
            map.setFeatureState(feature, { selected: true });
            showCard(feature);

            document.getElementById('mostra-video').style.display = 'none';
            // document.getElementById('esplora-button').style.display = 'none';


            // Nascondi il punto attivo dal layer 'places'
            map.setFilter('places', ['!=', ['get', 'video'], feature.properties.video]);
        }
    });

    // Clicking on the map will deselect the selected feature
    map.addInteraction('map-click', {
        type: 'click',
        handler: () => {
            map.setFilter('places', null);

            if (selectedFeature) {
                map.setFeatureState(selectedFeature, { selected: false });
                selectedFeature = null;
                card.style.display = 'none';
            }

            // Rimuovi il video precedente se esiste
            if (currentVideoId) {
                if (map.getLayer(currentVideoId)) {
                    map.removeLayer(currentVideoId);
                }
                if (map.getSource(currentVideoId)) {
                    map.removeSource(currentVideoId);
                }
            }

            document.getElementById('mostra-video').style.display = 'flex';
            // document.getElementById('esplora-button').style.display = 'flex';

            document.querySelector('.map-overlay').style.display = 'none';

            // Rimuovi l'eventuale extra-overlay se presente
            const extraOverlay = document.querySelector('.extra-overlay');
            if (extraOverlay) {
                extraOverlay.remove();
            }
        }
    });
        
    // Tooltip al passaggio del mouse
    const tooltip = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    //tiene traccia se è hover
    let hoveredId = null;

    map.on('mouseenter', 'places', (e) => {
        map.getCanvas().style.cursor = 'pointer';

        // Tooltip
        const coordinates = e.features[0].geometry.coordinates.slice();
        const name = e.features[0].properties.name;
        tooltip.setLngLat(coordinates).setHTML(`<code>${name}</code>`).addTo(map);

        //fai diventare il punto nero
        hoveredId = e.features[0].id;
        map.setFilter('places-hover', ['==', ['id'], hoveredId]);
    });

    map.on('mouseleave', 'places', () => {
        map.getCanvas().style.cursor = '';
        tooltip.remove();

        //fai tornare il punto blu
        hoveredId = null;
        map.setFilter('places-hover', ['==', '_id', '']); // nascondi
    });


    fetch('data/Aree Consorzio.geojson')
    .then(response => response.json())
    .then(data => {
        allFeatures = data.features;
    });

});


//--------------------------------------------------------------------------------------------------------------------------------------------


document.getElementById('return-button').addEventListener('click', () => {
    //ripristina la presenza di tutti i places
    map.setFilter('places', null);
    // mostra i punti della mappa quando il video è attivo
    map.setLayoutProperty('places', 'visibility', 'visible');


    const width = window.innerWidth;
    const isMobileOrTablet = width <= 1024;

    // Imposta centro e zoom in base al dispositivo
    const centerCoords = isMobileOrTablet
    ? [12.0970 + 0.075, 45.53435 - 0.025] // spostamento leggero a destra e in alto
    : [12.0970, 45.53435];

    const zoomLevel = isMobileOrTablet ? 10 : 10.7;

    map.flyTo({
        center: centerCoords,
        zoom: zoomLevel,
        speed: 1.8,
        curve: 1.4,
        essential: true
    });

    // Chiudi eventuale overlay
    card.style.display = 'none';

    document.getElementById('mostra-video').style.display = 'flex';
    // document.getElementById('esplora-button').style.display = 'flex';

    // Rimuovi eventuale video
    if (currentVideoId) {
        if (map.getLayer(currentVideoId)) map.removeLayer(currentVideoId);
        if (map.getSource(currentVideoId)) map.removeSource(currentVideoId);
        currentVideoId = null;
    }

    allFeatures.forEach(feature => {
        const sourceId = feature.properties.video;

        if (map.getLayer(sourceId)) {
            map.removeLayer(sourceId);
        }
        if (map.getSource(sourceId)) {
            map.removeSource(sourceId);
        }
    });

    videoVisibili = false;

    // Rimuovi l'eventuale extra-overlay se presente
    const extraOverlay = document.querySelector('.extra-overlay');
    if (extraOverlay) {
        extraOverlay.remove();
    }

    document.getElementById('mostra-video').innerHTML = '<code>MOSTRA VIDEO</code>';
    document.getElementById('mostra-video').style.backgroundColor = 'rgb(31,24,192)';
    document.getElementById('mostra-video').style.color = 'rgb(255,255,255)';
    document.getElementById('mostra-video').addEventListener('mouseenter', function() {
        this.style.border = 'solid 1px rgb(0,0,0)';
        this.style.color = 'black';
        this.style.backgroundColor = '#e0e73f';
    });
    document.getElementById('mostra-video').addEventListener('mouseleave', function() {
        this.style.color = 'rgb(255,255,255)';
        this.style.backgroundColor = 'rgb(31,24,192)';
        this.style.border = 'solid 1px rgb(0,0,0)';
    });

});


//--------------------------------------------------------------------------------------------------------------------------------------------


let videoVisibili = false;

document.getElementById('mostra-video').addEventListener('click', () => {
    if (!videoVisibili) {
        allFeatures.forEach(feature => {
            const sourceId = feature.properties.video;
            const videoUrl = `videos/${sourceId}.mp4`;

            // Coordinate: NO, NE, SE, SO
            const toLngLat = (str) => str.split(',').map(Number);
            const coordinates = [
                toLngLat(feature.properties.no),
                toLngLat(feature.properties.ne),
                toLngLat(feature.properties.se),
                toLngLat(feature.properties.so)
            ];

            // Evita duplicati
            if (!map.getSource(sourceId)) {
                map.addSource(sourceId, {
                    type: 'video',
                    urls: [videoUrl],
                    coordinates: coordinates
                });

                map.addLayer({
                    id: sourceId,
                    type: 'raster',
                    source: sourceId,
                });
            }

            const tooltip = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            });

            const hoverAreaId = `${feature.properties.video}-hover-area`;
                if (map.getLayer(hoverAreaId)) {
                    map.removeLayer(hoverAreaId);
                }
                if (map.getSource(hoverAreaId)) {
                    map.removeSource(hoverAreaId);
                }
            
                map.addLayer({
                id: hoverAreaId,
                type: 'fill',
                source: {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        geometry: {
                            type: 'Polygon',
                            coordinates: [[
                                toLngLat(feature.properties.no),
                                toLngLat(feature.properties.ne),
                                toLngLat(feature.properties.se),
                                toLngLat(feature.properties.so),
                                toLngLat(feature.properties.no)
                            ]]
                        },
                            properties: {
                            name: feature.properties.name
                        }
                    }
                },
                paint: {
                    'fill-opacity': 0
                }
            });

            // map.addLayer({
            //     id: `${feature.properties.video}-hover-area`,
            //     type: 'fill',
            //     source: {
            //         type: 'geojson',
            //         data: {
            //             type: 'Feature',
            //             geometry: {
            //                 type: 'Polygon',
            //                 coordinates: [[
            //                     toLngLat(feature.properties.no),
            //                     toLngLat(feature.properties.ne),
            //                     toLngLat(feature.properties.se),
            //                     toLngLat(feature.properties.so),
            //                     toLngLat(feature.properties.no) // chiusura del poligono
            //                 ]]
            //             },
            //             properties: {
            //                 name: feature.properties.name
            //             }
            //         }
            //     },
            //     paint: {
            //         'fill-opacity': 0
            //     }
            // });

            map.on('mouseenter', `${sourceId}-hover-area`, (e) => {
                map.getCanvas().style.cursor = 'pointer';

                // Coordinate del centro, tipo "12.3456,45.6789"
                const centerCoords = feature.geometry.coordinates.map(Number);

                tooltip.setLngLat(centerCoords)
                    .setHTML(`<code>${e.features[0].properties.name}</code>`)
                    .addTo(map);
            });

            map.on('mouseleave', `${sourceId}-hover-area`, () => {
                map.getCanvas().style.cursor = '';
                tooltip.remove();
            });

            map.on('click', `${sourceId}-hover-area`, (e) => {

                //ripristina la presenza di tutti i places
                map.setFilter('places', null);
                // mostra i punti della mappa quando il video è attivo
                map.setLayoutProperty('places', 'visibility', 'visible');

                showCard(feature);

                document.getElementById('mostra-video').style.display = 'none';
                // document.getElementById('esplora-button').style.display = 'none';
    
                // Nascondi il punto attivo dal layer 'places'
                map.setFilter('places', ['!=', ['get', 'video'], feature.properties.video]);
            });

        });

        videoVisibili = true;
        document.getElementById('mostra-video').innerHTML = '<code>NASCONDI VIDEO</code>';
        document.getElementById('mostra-video').style.backgroundColor = 'transparent';
        document.getElementById('mostra-video').style.color = 'rgb(31,24,192)';
        document.getElementById('mostra-video').addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgb(0,0,0)';
            this.style.color = '#f7f7f7';
        });
        document.getElementById('mostra-video').addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
            this.style.color = 'rgb(31,24,192)';
        });

        // nascondi i punti della mappa quando il video è attivo
        map.setLayoutProperty('places', 'visibility', 'none');



    } else {
        allFeatures.forEach(feature => {
            const sourceId = feature.properties.video;

            if (map.getLayer(sourceId)) {
                map.removeLayer(sourceId);
            }
            if (map.getSource(sourceId)) {
                map.removeSource(sourceId);
            }
        });

        videoVisibili = false;
        document.getElementById('mostra-video').innerHTML = '<code>MOSTRA VIDEO</code>';
        document.getElementById('mostra-video').style.backgroundColor = 'rgb(31,24,192)';
        document.getElementById('mostra-video').style.color = 'rgb(255,255,255)';
        document.getElementById('mostra-video').addEventListener('mouseenter', function() {
            this.style.border = 'solid 1px rgb(0,0,0)';
            this.style.color = 'black';
            this.style.backgroundColor = '#e0e73f';
        });
        document.getElementById('mostra-video').addEventListener('mouseleave', function() {
            this.style.color = 'rgb(255,255,255)';
            this.style.backgroundColor = 'rgb(31,24,192)';
            this.style.border = 'solid 1px rgb(0,0,0)';
        });

        // mostra i punti della mappa quando il video è attivo
        map.setLayoutProperty('places', 'visibility', 'visible');

    }
});


//--------------------------------------------------------------------------------------------------------------------------------------------

function aggiornaTestiPerMobileVert() {
    const isMobileVert = window.innerWidth <= 950;

    if (isMobileVert) {
        document.querySelector('#consorzio2').innerHTML = '© 2025';
    } else {
        document.querySelector('#consorzio2').innerHTML = '© 2025 Consorzio Acque Risorgive';
    }
}

// Chiamata iniziale
aggiornaTestiPerMobileVert();

// Opzionalmente aggiorna anche se la finestra viene ridimensionata
window.addEventListener('resize', aggiornaTestiPerMobileVert);
