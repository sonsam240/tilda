(() => {
  window.MD_RU_TEXT = text => typeof text === 'string' ? text.replace(/(?<![\p{L}\p{N}])([а-яё]|на|по|из|от|до|за|не|но|во|со|об) +(?=\S)/giu, '$1\u00a0') : text;
  window.MD_ON_READY( () => {
    document.querySelectorAll('.tn-atom').forEach(atom => {
      const walker = document.createTreeWalker(atom, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) walker.currentNode.textContent = window.MD_RU_TEXT(walker.currentNode.textContent);
    });
  }, {once:true});
})();
