const products = [
  {
    "id": "shift",
    "name": "SHIFT",
    "type": "Utility Windbreaker",
    "category": "Clothing",
    "color": "Black",
    "swatch": "#202125",
    "description": "A cropped black jacket with a high funnel collar and a full front zip. Oversized sleeves taper into gathered cuffs, with a zip pocket set at a different height on each sleeve.",
    "details": "Two drawcords with silver-tone toggles shape the collar. Raglan seams run across the shoulders, and side drawcord loops gather the hem.",
    "views": {
      "Black": [
        [
          "shift",
          "Studio front"
        ],
        [
          "shift-original",
          "Original front"
        ],
        [
          "shift-back",
          "Original back"
        ],
        [
          "shift-collar",
          "Collar detail"
        ],
        [
          "shift-flat",
          "Front laid flat"
        ],
        [
          "shift-back-flat",
          "Back laid flat"
        ]
      ]
    }
  },
  {
    "id": "transit",
    "name": "TRANSIT",
    "type": "Zip Waist Bag",
    "category": "Bags",
    "color": "Black",
    "swatch": "#1e1e20",
    "description": "A low-profile black waist bag with a pebbled finish. Two parallel silver-tone zips run across the front, with black tabs that are easy to grasp.",
    "details": "The adjustable strap closes with a black side-release buckle. A pocket on the reverse keeps smaller items close to the body.",
    "views": {
      "Black": [
        [
          "transit",
          "Studio front"
        ],
        [
          "transit-front",
          "Original front"
        ],
        [
          "transit-side",
          "Original side"
        ],
        [
          "transit-back",
          "Original back"
        ],
        [
          "transit-bottom",
          "Original underside"
        ]
      ]
    }
  },
  {
    "id": "cloud",
    "name": "CLOUD",
    "type": "Waffle Tote",
    "category": "Bags",
    "color": "Cream",
    "swatch": "#e6e1ce",
    "description": "A soft tote with small, raised waffle squares from the base to the handles. The sides taper towards the opening, giving the bag its rounded shape.",
    "details": "The gathered handles share the texture of the body. Explore cream, black, and yellow to see each color in the supplied photographs.",
    "views": {
      "Cream": [
        [
          "cloud",
          "Studio front"
        ],
        [
          "tote-source-cream",
          "Original photograph"
        ]
      ],
      "Black": [
        [
          "cloud-black",
          "Studio front"
        ],
        [
          "tote-source-black",
          "Original photograph"
        ]
      ],
      "Yellow": [
        [
          "cloud-yellow",
          "Studio front"
        ],
        [
          "tote-source-yellow",
          "Original photograph"
        ]
      ]
    }
  }
];
const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];let filter='All',query='',toastTimer;
let bag=[];try{const parsed=JSON.parse(localStorage.getItem('vermov-bag')||'[]');if(Array.isArray(parsed))bag=parsed.filter(x=>products.some(p=>p.id===x.id)&&Number.isInteger(x.qty)&&x.qty>0).map(x=>({id:x.id,color:products.find(p=>p.id===x.id).views[x.color]?x.color:products.find(p=>p.id===x.id).color,qty:Math.min(x.qty,10)}));}catch{}
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function openDialog(id){const d=$(id);if(!d.open)d.showModal();}
function closeDialogs(){$$('dialog[open]').forEach(d=>d.close());}
$$('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
$$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
function toast(message){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').classList.add('visible');toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3000);}
function persistBag(){try{localStorage.setItem('vermov-bag',JSON.stringify(bag));}catch{toast('Your bag is available for this visit.');}updateCount();}
function updateCount(){const n=bag.reduce((s,x)=>s+x.qty,0);$('#bag-count').textContent=n;$('#bag-open').setAttribute('aria-label',`Open shopping bag, ${n} items`);$('#bag-title-count').textContent=`(${n})`;}
function addToBag(id,color=products.find(p=>p.id===id).color){const existing=bag.find(x=>x.id===id&&x.color===color);if(existing&&existing.qty>=10){toast('You already have 10 of this piece in your bag.');return;}if(existing)existing.qty++;else bag.push({id,color,qty:1});persistBag();toast(`${products.find(p=>p.id===id).name} added to your bag`);}
function productCard(p,i){return `<article class="product-card"><div class="product-photo"><a href="#product-${p.id}" aria-label="Explore ${p.name} ${p.type}"><img src="assets/${p.id}.jpg" alt="${escapeHTML(p.color+' '+p.type+' — styling reference')}" loading="lazy" width="600" height="800"></a>${i<3?'<span class="product-tag">THE FIRST EDIT</span>':''}<button class="quick-add" data-add="${p.id}" aria-label="${p.id==='cloud'?'Choose CLOUD color':'Add '+p.name+' to bag'}">+</button></div><div class="product-name"><button data-product="${p.id}">${p.name} / ${p.type}</button><span>COMING SOON</span></div><p class="product-description">${Object.keys(p.views).join(' / ')}</p><span class="color-dot" style="background:${p.swatch}" aria-hidden="true"></span></article>`;}
function render(){const matched=products.filter(p=>(filter==='All'||p.category===filter)&&(!query||`${p.name} ${p.type} ${p.category} ${Object.keys(p.views).join(' ')} ${p.description}`.toLowerCase().includes(query.toLowerCase())));$('#product-grid').innerHTML=matched.length?matched.map(productCard).join(''):'<div class="no-results"><h3>No pieces found.</h3><p>Try a different search or explore the full edit.</p><button class="button dark" id="reset-search">View all pieces ↗</button></div>';$('#result-count').textContent=`${matched.length} ${matched.length===1?'piece':'pieces'}`;$$('[data-filter]').forEach(b=>{b.classList.toggle('active',b.dataset.filter===filter);b.setAttribute('aria-pressed',String(b.dataset.filter===filter));});const label=$('#search-results-label');label.hidden=!query;if(query){label.innerHTML=`Results for “${escapeHTML(query)}” <button id="clear-search">Clear search</button>`;$('#clear-search').onclick=()=>setFilter(filter,'');}$('#reset-search')?.addEventListener('click',()=>setFilter('All',''));$$('[data-add]').forEach(b=>b.onclick=()=>b.dataset.add==='cloud'?location.hash='product-cloud':addToBag(b.dataset.add));$$('[data-product]').forEach(b=>b.onclick=()=>location.hash=`product-${b.dataset.product}`);}
function setFilter(category,q=''){filter=category;query=q;const u=new URL(location);u.searchParams.delete('category');u.searchParams.delete('q');if(category!=='All')u.searchParams.set('category',category);if(q)u.searchParams.set('q',q);u.hash='collection';history.pushState({},'',u);closeDialogs();render();window.enhanceProducts?.();$('#collection').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
$$('[data-filter]').forEach(b=>b.onclick=()=>setFilter(b.dataset.filter,query));$$('[data-category]').forEach(a=>a.onclick=e=>{e.preventDefault();setFilter(a.dataset.category);});$$('.mobile-nav a:not([data-category])').forEach(a=>a.onclick=closeDialogs);
function showProduct(id,chosenColor){const p=products.find(x=>x.id===id);if(!p)return;$('#product-content').innerHTML=`<div class="product-detail"><div class="detail-image"><img src="assets/${p.id}.jpg" alt="${escapeHTML(p.type)} styling inspiration" width="800" height="1067"></div><div class="detail-copy"><p class="eyebrow">VERMOV / THE EVERYDAY MOTION EDIT</p><h2 id="product-title">${p.name}</h2><p class="detail-subtitle">${p.type}</p><p class="price">Coming soon · Pricing to be announced</p><p class="detail-description">${p.description}</p><div class="detail-color"><span class="color-dot" style="background:${p.swatch}"></span>${p.color}</div><button class="button blue" id="detail-add">Add to bag <span>+</span></button><p class="preview-note">Save this piece to your preview bag. Purchases are not open yet. Compare the studio recreation with the original photographs in the gallery.</p><details><summary>Design & details</summary><p>${p.details}</p></details><details><summary>Size & fit</summary><p>${p.category==='Bags'?'Dimensions and capacity':'Measurements and available sizes'} will be published with the final collection. No size is reserved by adding to this preview bag.</p></details><details><summary>Delivery & returns</summary><p>Delivery regions, pricing, and return terms will be available before purchasing opens.</p></details></div></div>`;const color = chosenColor || p.color;
 const options = Object.keys(p.views);
 const colors = document.querySelector('.detail-color');
 colors.innerHTML = '<span>Color</span> ' + options.map(c => '<button class="tone" aria-pressed="'+(c===color)+'" data-tone="'+c+'">'+c+'</button>').join('');
 colors.querySelectorAll('button').forEach(b=>b.onclick=()=>showProduct(id,b.dataset.tone));
 const media = document.querySelector('.detail-image');
 const first = media.querySelector('img');
 const tabs = document.createElement('div');
 tabs.className='gallery-tabs';
 tabs.setAttribute('role','group');tabs.setAttribute('aria-label','Product views');
 function selectView(index){
   const [file,label]=p.views[color][index];
   first.src='assets/'+file+'.jpg';
   first.alt=p.name+' '+p.type+', '+color+' — '+label;
   tabs.querySelectorAll('button').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
 }
 p.views[color].forEach((view,index)=>{
   const button=document.createElement('button');
   button.textContent=view[1];
   button.onclick=()=>selectView(index);
   tabs.appendChild(button);
 });
 media.appendChild(tabs);selectView(0);
 $('#detail-add').onclick=()=>{addToBag(id,color);$('#detail-add').textContent='Added · '+color;};
 openDialog('#product-dialog');}
function renderBag(){updateCount();$('#bag-content').innerHTML=bag.length?bag.map(x=>{const p=products.find(p=>p.id===x.id);return `<div class="bag-item"><img src="assets/${p.views[x.color][0][0]}.jpg" alt="${p.name} in ${x.color}"><div><h3>${p.name} / ${p.type}</h3><p>${x.color} · Collection preview</p><div class="bag-row"><div class="qty"><button data-qty="${p.id}" data-color="${x.color}" data-delta="-1" aria-label="Decrease ${p.name} quantity">−</button><span>${x.qty}</span><button data-qty="${p.id}" data-color="${x.color}" data-delta="1" aria-label="Increase ${p.name} quantity">+</button></div><button class="remove" data-remove="${p.id}" data-color="${x.color}">Remove</button></div></div></div>`;}).join('')+'<div class="bag-summary"><p>Your preview bag is saved on this device. Pricing, sizes, and availability will be confirmed when the collection launches.</p><button class="button blue" id="checkout-preview">Review bag <span>↗</span></button><p style="margin-top:16px">Purchasing is not open yet. No payment is collected.</p></div>':'<div class="empty-bag"><h3>Your next move<br>starts here.</h3><p>Discover a piece for your everyday.</p><button class="button dark" id="bag-explore">Explore the collection ↗</button></div>';$$('[data-qty]').forEach(b=>b.onclick=()=>{const x=bag.find(x=>x.id===b.dataset.qty&&x.color===b.dataset.color);x.qty=Math.min(10,x.qty+Number(b.dataset.delta));bag=bag.filter(x=>x.qty>0);persistBag();renderBag();});$$('[data-remove]').forEach(b=>b.onclick=()=>{bag=bag.filter(x=>x.id!==b.dataset.remove||x.color!==b.dataset.color);persistBag();renderBag();});$('#bag-explore')?.addEventListener('click',()=>setFilter('All'));$('#checkout-preview')?.addEventListener('click',()=>{closeDialogs();showInfo('checkout');});}
$('#bag-open').onclick=()=>{renderBag();openDialog('#bag-dialog');};$('#menu-open').onclick=()=>openDialog('#menu-dialog');$('#search-open').onclick=()=>{openDialog('#search-dialog');$('#search-input').focus();};$('#search-form').onsubmit=e=>{e.preventDefault();setFilter('All',$('#search-input').value.trim());};$$('[data-search]').forEach(b=>b.onclick=()=>b.dataset.search==='tote'?setFilter('Bags','tote'):setFilter(b.dataset.search));
const info={shipping:['Shipping & returns','<p>We’re preparing the first VERMOV collection. Shipping destinations, costs, delivery estimates, and return terms will be shared before orders open.</p><p>No purchases or payments can be made through this collection preview.</p>'],sizing:['Find your fit.','<p>Each piece will have its own measurements and fit guide when the collection launches. For now, explore the silhouettes and save your favorites to your bag.</p>'],contact:['Let’s stay close.','<p>Our official contact channel will be added when VERMOV opens for orders. In the meantime, explore the collection and keep this page bookmarked.</p>'],privacy:['Your space. Your choice.','<p>This preview stores your bag on this device using browser storage. It does not collect payment or email details. Images are hosted with the site; the typefaces are also hosted with the site.</p><p>You can clear the saved bag below.</p><button class="text-link" id="clear-data">Clear saved bag ↗</button>'],updates:['Keep the next chapter close.','<p>Bookmark VERMOV to return to the collection. Your bag is saved on this device, ready for your next visit.</p><p>Email updates will be available when the official mailing list opens.</p>'],checkout:['Your edit is saved.','<p>Your selected pieces are in your preview bag. Final pricing, available sizes, and delivery options are still to come.</p><p>Purchasing has not opened, so no order has been placed and no payment is required.</p>'],credits:['Behind the images.','<p>VERMOV supplied the product references. Each studio view was recreated using those images. The galleries include the original angles and colors.</p><p>Campaign photography by SALOMON BYUMA and Daniel Olivier via Pexels.</p>']};
function showInfo(key){const [title,body]=info[key];$('#info-title').textContent=title;$('#info-body').innerHTML=body;openDialog('#info-dialog');$('#clear-data')?.addEventListener('click',()=>{bag=[];persistBag();toast('Saved bag cleared');});}
$$('[data-info]').forEach(b=>b.onclick=()=>showInfo(b.dataset.info));$('#updates-button').onclick=()=>showInfo('updates');$('#year').textContent=new Date().getFullYear();
function readLocation(){const u=new URL(location);filter=['Clothing','Bags'].includes(u.searchParams.get('category'))?u.searchParams.get('category'):'All';query=u.searchParams.get('q')||'';render();if(location.hash.startsWith('#product-'))showProduct(location.hash.slice(9));else if($('#product-dialog').open)$('#product-dialog').close();}
window.addEventListener('popstate',readLocation);window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#product-'))showProduct(location.hash.slice(9));else if($('#product-dialog').open)$('#product-dialog').close();});$('#product-dialog').addEventListener('close',()=>{if(location.hash.startsWith('#product-')){const u=new URL(location);u.hash='collection';history.replaceState({},'',u);}});readLocation();updateCount();
