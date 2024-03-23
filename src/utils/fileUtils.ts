export const addTimeToFileName = (fileName: string) => {
  const date = new Date()
  const time = date.getTime()
  return `${time}-${fileName}`
}
