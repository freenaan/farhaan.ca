(function(){
  const colors = ['#FF6B6B','#FFD93D','#6BCB77','#4D96FF','#9B5DE5','#F15BB5']
  const count = 40
  for(let i=0;i<count;i++){
    const el = document.createElement('div')
    el.className = 'confetti-piece'
    const size = Math.floor(Math.random()*12)+8
    el.style.width = size + 'px'
    el.style.height = Math.floor(size*1.4)+'px'
    el.style.left = Math.random()*100 + 'vw'
    el.style.background = colors[Math.floor(Math.random()*colors.length)]
    const duration = 3000 + Math.random()*3000
    el.style.animationDuration = duration + 'ms'
    el.style.opacity = 0.9 + Math.random()*0.1
    el.style.transform = `rotate(${Math.floor(Math.random()*360)}deg)`
    document.body.appendChild(el)
    // remove after finished
    setTimeout(()=>el.remove(), duration+100)
  }
})();
