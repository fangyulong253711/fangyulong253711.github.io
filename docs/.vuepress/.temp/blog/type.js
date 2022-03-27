export const typeMap = {"article":{"/":{"path":"/article/","keys":["v-cd1aa97a","v-48d2a58d","v-1858945c","v-28aafbc8","v-af6d1ffe","v-c9884392","v-1c22cb96","v-47792baa","v-355c4aaa","v-511c7947","v-3c33bfe2","v-4215c56e","v-fb949372","v-345af680","v-0b9aa719","v-0b92cb1d","v-0f186abb","v-2ac38bbb","v-1cc36fe2","v-0e739540","v-79fdd481","v-0e503981","v-99340306"]}},"encrypted":{"/":{"path":"/encrypted/","keys":[]}},"slide":{"/":{"path":"/slides/","keys":["v-0e503981"]}},"star":{"/":{"path":"/star/","keys":["v-1cc36fe2"]}},"timeline":{"/":{"path":"/timeline/","keys":["v-cd1aa97a","v-48d2a58d","v-1858945c","v-28aafbc8","v-af6d1ffe","v-c9884392","v-1c22cb96","v-47792baa","v-355c4aaa","v-511c7947","v-3c33bfe2","v-4215c56e","v-fb949372","v-345af680","v-0b9aa719","v-0b92cb1d","v-0f186abb","v-2ac38bbb","v-1cc36fe2","v-0e739540"]}}}

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateBlogType) {
    __VUE_HMR_RUNTIME__.updateBlogType(typeMap)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ typeMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogType(typeMap)
  })
}
