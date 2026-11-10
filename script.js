const products = [
  { name: 'Saint',    price: '$80',  sizes: ['S', 'M', 'L'], image:'images/saint.png'},
  { name: 'Burnt Red',    price: '$140', sizes: ['M', 'L', 'XL'],image:'images/lazydevil2.png' },
  { name: 'Evil Angel',   price: '$110', sizes: ['S', 'M', 'L'],image:'images/lazydevil2.png' },
  
  
];
const garments= document.querySelectorAll('.garment');
let selected = null;

function resetRack() {
    garments.forEach(function (g) {
        g.classList.remove('peek', 'push-left', 'push-right');
    });
    selected = null
}

function peekGarment(index){
    resetRack();
   garments.forEach(function (g,i){
    if (i === index){
        g.classList.add('peek');

    } else if (i < index){
        g.classList.add('push-left')
    } else{
        g.classList.add('push-right')
    }
   });

   selected = index;
   garments[index].scrollIntoView({
    behavior : 'smooth',
    inline : 'center',
    block: 'nearest'

   });
}

garments.forEach(function(g, i){
    g.addEventListener('click', function(){
       if (selected === i){
        openFullview(i);
       } else {
            peekGarment(i);
        }
    });
    

});

const modal = document.getElementById('modal');

function openFullview(i){
    const p = products[i];
    document.getElementById('modalname').textContent = p.name;

    document.getElementById('modalprice').textContent = p.price;

  const modalimage = document.getElementById('modalimage');

modalimage.style.backgroundColor = p.color;
modalimage.style.backgroundImage = `url("${p.image}")`;
modalimage.style.backgroundSize = 'cover';
modalimage.style.backgroundPosition = 'center';
modalimage.style.backgroundRepeat = 'no-repeat';


const sizesbox = document.getElementById('modalsizes');
 sizesbox.innerHTML = '';
 p.sizes.forEach(function(size){
    const b= 
    document.createElement('button');
    b.textContent = size;
    b.className = 'size-btn';
    sizesbox.appendChild(b);
 });
 modal.hidden = false;
}
 document.getElementById('closebtn').addEventListener('click', function(){
    modal.hidden = true;
 });
 modal.addEventListener('click', function(e){
    if(e.target === modal){
        modal.hidden = true;

    }
 })


 
 document.addEventListener('click', function (e) {
  if (!e.target.closest('.garment') && !e.target.closest('.modal')) {
    resetRack();
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    if (!modal.hidden) {
      modal.hidden = true;
    } else {
      resetRack();
    }
  }
  if (selected === null || !modal.hidden) return;
  if (e.key === 'ArrowRight' && selected < garments.length - 1) {
    peekGarment(selected + 1);
  }
  if (e.key === 'ArrowLeft' && selected > 0) {
    peekGarment(selected - 1);
  }
});

const rack = document.querySelector('.rack');
let startX = 0;

rack.addEventListener('touchstart', function (e) {
  startX = e.touches[0].clientX;
});

rack.addEventListener('touchend', function (e) {
  const diff = e.changedTouches[0].clientX - startX;
  if (Math.abs(diff) < 50) return;

  const key = diff < 0 ? 'ArrowRight' : 'ArrowLeft';
  document.dispatchEvent(new KeyboardEvent('keydown', { key: key }));
});


const hanger = garments[index].querySelector('.hanger');

hanger.classList.remove('swing');

void hanger.offsetWidth;

hanger.classList.add('swing');

