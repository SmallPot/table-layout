 
const isMergeableObject=(val)=> {
  let nonNullObject = val && typeof val === 'object'

  return nonNullObject
      && Object.prototype.toString.call(val) !== '[object RegExp]'
      && Object.prototype.toString.call(val) !== '[object Date]'
}

const emptyTarget=(val)=> {
  return Array.isArray(val) ? [] : {}
}

const cloneIfNecessary=(value, optionsArgument)=>{
  let clone = optionsArgument && optionsArgument.clone === true
  return (clone && isMergeableObject(value)) ? deepmerge(emptyTarget(value), value, optionsArgument) : value
}

const defaultArrayMerge=(target, source, optionsArgument)=>{
  let destination = target.slice()
  source.forEach((e, i)=>{
      if (typeof destination[i] === 'undefined') {
          destination[i] = cloneIfNecessary(e, optionsArgument)
      } else if (isMergeableObject(e)) {
          destination[i] = deepmerge(target[i], e, optionsArgument)
      } else if (target.indexOf(e) === -1) {
          destination.push(cloneIfNecessary(e, optionsArgument))
      }
  })
  return destination
}

const mergeObject=(target, source, optionsArgument)=>{
  let destination = {}
  if (isMergeableObject(target)) {
      Object.keys(target).forEach( (key)=> {
          destination[key] = cloneIfNecessary(target[key], optionsArgument)
      })
  }
  Object.keys(source).forEach( (key) =>{
      if (!isMergeableObject(source[key]) || !target[key]) {
          destination[key] = cloneIfNecessary(source[key], optionsArgument)
      } else {
          destination[key] = deepmerge(target[key], source[key], optionsArgument)
      }
  })
  return destination
}

const deepmerge=(target, source, optionsArgument)=> {

  let array = Array.isArray(source);
  let options = optionsArgument || { arrayMerge: defaultArrayMerge }
  let arrayMerge = options.arrayMerge || defaultArrayMerge

  if (array) {
      return Array.isArray(target) ? arrayMerge(target, source, optionsArgument) : cloneIfNecessary(source, optionsArgument)
  } else {
      return mergeObject(target, source, optionsArgument)
  }
}

deepmerge.all =(array, optionsArgument)=>{
  if (!Array.isArray(array) || array.length < 2) {
      throw new Error('first argument should be an array with at least two elements')
  }

  // we are sure there are at least 2 values, so it is safe to have no initial value
  return array.reduce((prev, next)=> {
      return deepmerge(prev, next, optionsArgument)
  })
}



export  {
  deepmerge
}