let components = {};

// 注册表单项渲染组件，便于切换 UI 组件库
export function registerFieldComponent(type, Component){
  if ( typeof type === 'object' ){
    const Comps = type;
    Object.keys(Comps).map(tp => {
      components[tp] = Comps[tp];
    });

    return;
  };
  
  if ( arguments.length == 2 ){
    components[type] = Component;
  };
};

// 获取注册的表单项组件
export function acquireFieldComponent(type){
  if ( !type ) return components;

  if ( !components[type] ){
    console.warn(`Did you forget to register ${type} Component.`)
  }

  return components[type];
};

// 注册别名
export function alias(){

}