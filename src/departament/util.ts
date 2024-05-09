import { Departament } from 'src/database/entities/departament.entity'

export function WrapDepartament(departament: Departament): Departament {
  const wrapDepart = { ...departament }

  if (wrapDepart.children.length == 0) {
    delete wrapDepart.children
    return wrapDepart
  }

  delete wrapDepart.doctors
  wrapDepart.children = wrapDepart.children.map((child, index) => {
    return WrapDepartament(child)
  })

  return wrapDepart
}
