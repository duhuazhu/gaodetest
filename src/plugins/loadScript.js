/**
 * Description:
 * Author: duhuazhu
 * Date: 2022/10/31
 */
//动态加载外部js
//@param RESOURCE_LIST 外部地址集合["address"]
export function loadVoLteResourceList (RESOURCE_LIST,success) {
  return new Promise(r=>{
    RESOURCE_LIST.reduce((res, el) => res.then(() => loadScript(el)), Promise.resolve()).then(() => {
      r()
    }).catch((error) => {
      console.error('前置js资源加载失败:', error.name, error.message)
      return Promise.reject(error)
    })
  })
}

export function loadScript (url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')

    script.onload = () => resolve()

    script.onerror = () => reject(new Error(`Load script from ${url} failed`))

    script.src = url
    const head =
      document.head || document.getElementsByTagName('head')[0]
    ;(document.body || head).appendChild(script)
  })
}
