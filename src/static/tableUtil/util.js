export  function  mergeCol(colN, rowN, count){
  let dom = document.querySelectorAll('.ivu-table-tbody .ivu-table-row')
  let lineDom = dom[colN]
  let firstDom = dom[colN].children[rowN]
  firstDom.setAttribute('colspan', count)
  let next = firstDom
  for(let i=0; i<count-1; i++){
    next = next.nextElementSibling
    next.classList.add('removeF')
  }
  next = firstDom
  for(let i=0; i<lineDom.children.length; i++){
    if(lineDom.children[i].classList.contains('removeF')){
      lineDom.children[i].remove()
      i--
    }
  }
}
export  function  mergeRow(childN, rowN, count){
  let dom = document.querySelectorAll('.ivu-table-tbody .ivu-table-row')
  let lineDom = dom[rowN]
  let firstDom = dom[rowN].children[childN]
  firstDom.setAttribute('rowspan', count)
  let next = lineDom
  for(let i=0; i<count-1; i++){
    next = next.nextElementSibling
    next.children[childN].classList.add('removeF')
  }
  for(let i=0; i<dom.length; i++){
    for(let j=0; j<dom[i].children.length; j++){
      if(dom[i].children[j].classList.contains('removeF')){
        dom[i].children[j].remove()
        j--
      }
    }
  }
}