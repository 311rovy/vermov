/* Uses dashersw/liquid-glass-js (MIT), with a static, local hero image sampler.
   No page capture, tracking, animation framework, or perpetual render loop. */
(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const hero=document.querySelector('.hero-media'),photo=hero.querySelector('img');
 const content='<a href="#collection" aria-label="Explore the Everyday Motion Edit"><span class="glass-index">01</span><span class="glass-copy"><small>FORM MEETS FREEDOM</small><strong>The Everyday Motion Edit</strong></span><span class="glass-arrow">↗</span></a>';
 let fallback=document.createElement('div');fallback.className='glass-feature';fallback.innerHTML=content;hero.appendChild(fallback);
 const progress=document.createElement('div');progress.className='scroll-progress';progress.setAttribute('aria-hidden','true');document.body.appendChild(progress);
 let scrollPending=false;
 addEventListener('scroll',()=>{if(scrollPending)return;scrollPending=true;requestAnimationFrame(()=>{document.querySelector('.header').classList.toggle('is-scrolled',scrollY>25);const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?scrollY/max:0})`;scrollPending=false;});},{passive:true});
 if(!reduced.matches&&'IntersectionObserver'in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');observer.unobserve(e.target);}}),{threshold:.08});
  document.querySelectorAll('.section-head,.catalog-controls,.carry-panel,.editorial-media,.editorial-copy,.newsletter>div').forEach((el,i)=>{el.classList.add('reveal');el.style.setProperty('--delay',`${i%2*80}ms`);observer.observe(el);});
  document.documentElement.classList.add('motion-ready');
 }
 // Reveal each catalogue photograph once, including photos inserted by filters.
 const grid = document.querySelector('#product-grid');
 if ('IntersectionObserver' in window) {
   const photoObserver = new IntersectionObserver(entries => {
     entries.forEach(entry => {
       if (!entry.isIntersecting) return;
       photoObserver.unobserve(entry.target);
       if (!reduced.matches) entry.target.classList.add('photo-in-view');
     });
   }, {threshold: 0.12});
   function observePhotos() {
     photoObserver.disconnect();
     grid.querySelectorAll('.product-photo:not(.photo-in-view)').forEach(photo => photoObserver.observe(photo));
   }
   new MutationObserver(observePhotos).observe(grid, {childList:true});
   observePhotos();
 }

 document.addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(b){b.classList.add('added');setTimeout(()=>b.classList.remove('added'),500);}});
 // One large image with a genuine zoom view, rather than invented product angles.
 const zoom=document.createElement('dialog');zoom.className='zoom-dialog';zoom.setAttribute('aria-label','Product image zoom');zoom.innerHTML='<button class="close-button" aria-label="Close image zoom">×</button><img alt="">';document.body.appendChild(zoom);zoom.querySelector('button').onclick=()=>zoom.close();
 const productBody=document.querySelector('#product-content');
 new MutationObserver(()=>{const media=productBody.querySelector('.detail-image');if(!media||media.querySelector('.image-zoom'))return;const b=document.createElement('button');b.className='image-zoom';b.textContent='View image ↗';b.onclick=()=>{const img=media.querySelector('img');zoom.querySelector('img').src=img.src;zoom.querySelector('img').alt=img.alt;zoom.showModal();};media.appendChild(b);}).observe(productBody,{childList:true});
 // Desktop optical refraction from the requested library. Mobile/reduced motion
 // retain the accessible CSS glass surface to avoid unnecessary GPU work.
 async function initGlass(){
  if(reduced.matches||innerWidth<768||typeof Container==='undefined')return;
  try{
   await photo.decode();await document.fonts.ready;
   if(!document.createElement('canvas').getContext('webgl'))return;
   function snapshot(){const h=hero.getBoundingClientRect(),p=photo.getBoundingClientRect();const c=document.createElement('canvas');c.width=innerWidth;c.height=Math.ceil(h.bottom+scrollY);const x=c.getContext('2d');x.fillStyle='#efefe9';x.fillRect(0,0,c.width,c.height);const scale=Math.max(p.width/photo.naturalWidth,p.height/photo.naturalHeight);const w=photo.naturalWidth*scale,ht=photo.naturalHeight*scale;x.save();x.beginPath();x.rect(h.left,h.top+scrollY,h.width,h.height);x.clip();x.drawImage(photo,p.left+(p.width-w)*.5,p.top+scrollY+(p.height-ht)*.44,w,ht);x.restore();return c;}
   Container.pageSnapshot=snapshot();
   class EditorialGlass extends Container{
    startRenderLoop(){const render=()=>{if(document.hidden||!this.gl_refs.gl)return;const r=this.element.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;const gl=this.gl_refs.gl;gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform1f(this.gl_refs.scrollYLoc,scrollY);const p=this.getPosition();gl.uniform2f(this.gl_refs.containerPositionLoc,p.x,p.y);gl.drawArrays(gl.TRIANGLES,0,6);};let pending=false;this.render=render;render();this.element.classList.add('has-refraction');addEventListener('scroll',()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;render();});},{passive:true});}
   }
   window.glassControls={blurRadius:3,edgeIntensity:.012,rimIntensity:.035,baseIntensity:.004,edgeDistance:.15,rimDistance:.8,baseDistance:.1,cornerBoost:.012,rippleEffect:.015};
   const glass=new EditorialGlass({borderRadius:24,type:'rounded',tintOpacity:.18});glass.element.classList.add('glass-feature');glass.element.insertAdjacentHTML('beforeend',content);glass.canvas.setAttribute('aria-hidden','true');fallback.replaceWith(glass.element);glass.updateSizeFromDOM();
   glass.canvas.addEventListener('webglcontextlost',()=>{glass.element.classList.remove('has-refraction');glass.canvas.hidden=true;});
   let resizeTimer;addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(innerWidth<768){glass.canvas.hidden=true;glass.element.classList.remove('has-refraction');return;}const snap=snapshot();const gl=glass.gl_refs.gl;if(gl){gl.bindTexture(gl.TEXTURE_2D,glass.gl_refs.texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,snap);gl.uniform2f(glass.gl_refs.textureSizeLoc,snap.width,snap.height);glass.canvas.hidden=false;glass.element.classList.add('has-refraction');glass.updateSizeFromDOM();requestAnimationFrame(()=>glass.render?.());}},200);});
  }catch(error){console.warn('Optical glass unavailable; using frosted surface.');}
 }
 if(document.readyState==='complete')initGlass();else addEventListener('load',initGlass,{once:true});
})();
