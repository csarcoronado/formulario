import { useEffect, useState } from "react";
import './nuevoproducto.css'
import { fileUpload } from "../../helpers/fileUpload";
import { usePosContext } from "../context/PosProvider";


export interface ModalPropsNuevo {
  indexEditar?: number
  setModalOpen?: React.Dispatch<React.SetStateAction<string>>
}
  
const NuevoProducto = ({indexEditar, setModalOpen}: ModalPropsNuevo) => {
    const {setCrearNewProducto, crearNewProducto, categoriaCreated} = usePosContext()
    const {formErrors, setFormErrors} = ManejodeErroresPre() 
    const onCloseModal = () => {
        setFormErrors({producto: '', codigoDeBarra: '', unidadDeMedida: '', precio: '', cantidad: '', impuesto: ''})
    }
  const [formData, setFormData] = useState({
    producto: "",
    codigoDeBarra: "",
    unidadDeMedida: "",
    precio: "",
    cantidad : "",
    impuestos: ""
  })
  const [upload, setUpload] = useState<null | string>(null)

  const [mensaje, setMensaje] = useState('')
  

  const handleFormData = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

    const onSubmit = async(e: React.FormEvent) => {
      e.preventDefault()
      const errors: { [key: string]: string } = {};
      if (formData.producto === '') {
          errors.producto = 'El campo producto es obligatorio';
        }
        if (formData.codigoDeBarra === '' || codigoDeBarraValido(formData.codigoDeBarra, false)) {
          errors.codigoDeBarra = 'Error en CodigoDeBarra';
        }
        if (formData.unidadDeMedida === '') {
          errors.unidadDeMedida = 'El campo unidadDeMedida es obligatorio';
        }
        if (formData.precio === '') {
          errors.precio = 'El campo Precio es obligatorio';
        }
        if (formData.cantidad === '') {
          errors.cantidad = 'El campo Cantidad es obligatorio';
        }
        if (formData.impuestos === '') {
          errors.impuestos = 'El campo impuestos es obligatorio';
        }
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement> ) => {
      setUpload(e.target.files[0]);
    };
  
    const imgUploadNew = await fileUpload(upload)
    if (Object.keys(errors).length === 0) {
    if (indexEditar !== undefined){
      const findId = crearNewProducto.find((_item, i) => i === indexEditar)
       const newData = {name: formData.producto, precio: formData.precio, quantity: formData.cantidad, id:findId?.id, img:imgUploadNew, codigoDeBarra: formData.codigoDeBarra, identify: 'hola'}
       const ProductoNuevo = crearNewProducto.map((item, index) => index === indexEditar ? {...item, ...newData} : item)
       if(ProductoNuevo){
       setCrearNewProducto(ProductoNuevo)
       setFormData({ producto: "",codigoDeBarra: "",unidadDeMedida: "",precio: "",cantidad : "",impuestos: ""})
       setMensaje('Producto nuevo editado correctamente')
       setTimeout(() => {
        setMensaje('')
       }, 2000); 
    }
     return
   }
   setCrearNewProducto( prevProduct => [...prevProduct, {id:crypto.randomUUID(), name: formData.producto, precio: formData.precio, unidadDeMedida: formData.unidadDeMedida, codigoDeBarra: formData.codigoDeBarra, cantidad: formData.cantidad, impuestos: formData.impuestos}])
    setFormData({producto: '', codigoDeBarra:'', unidadDeMedida: '', precio: '', cantidad: '', impuestos: ''})
    onCloseModal()
    setMensaje('Producto nuevo agregado correctamente')
    setTimeout(() => {
      setMensaje('')
    });}
    
  }
  


         
     
useEffect(() => {
 if(indexEditar !== undefined) {
  const findCrearNewProduct = crearNewProducto.find((item, index) => index === indexEditar)
  if(findCrearNewProduct)
  setFormData({producto: findCrearNewProduct?.name, precio: findCrearNewProduct?.precio, cantidad: findCrearNewProduct?.quantity, codigoDeBarra: findCrearNewProduct?.codigoDeBarra, unidadDeMedida: '', impuestos: ''})
  setUpload(findCrearNewProduct?.img)
   return
 }
 setFormData({ producto: "",codigoDeBarra: "",unidadDeMedida: "",precio: "",cantidad : "",
 impuestos: ""})
 setUpload('')
}, [indexEditar])

const  handleCloseModal = () => {
  if(setModalOpen)
  setModalOpen('')
  }
  return (
    <>
      <div
           className="modal fade show d-flex justify-content-center align-items-center"
           style={{
             position: 'fixed',
             top: 0,
             left: 0,
             right: 0,
             width: '100%',
             height: '100%',
             display: 'flex',
             justifyContent: 'center',
             alignItems: 'center',
             backgroundColor: 'rgba(0, 0, 0, 0.5)',
             zIndex: 9999,
           }}
        >
          <div className="modal-dialog d-flex justify-content-center align-items-center " style={{width: '100%'}}>
            <div className="modal-content "     style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "50%",
      backgroundColor: "white",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
      borderRadius: "5px",
      overflow: "hidden",
    }}>
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Clientes
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body" style={{ padding: '20px', maxHeight: '70vh', overflowY: 'auto' }}>
              <div className="d-flex justify-content-center">
              { mensaje && <span className="alert alert-success text-center w-full">{mensaje}</span>}
              </div>
              <form className="nuevoProducto" onSubmit={onSubmit} >
  <div className="container">
    <div className="row">
      <div className="col-12">
      <div className="d-flex gap-2 align-items-center">
        <h3 className="title-producto">{ indexEditar !== undefined ? 'Editar Producto': 'Nuevo Producto' }</h3>
        <div className="circle-input">
            <div className="circle">
                <div className="initials">{initials}
        <p className="descripcion-producto">{ indexEditar !== undefined ? 'Editar Producto de tu POS' : 'Crear producto de tu POS'}</p>
        <div >
        <div className="d-flex gap-2">
        <CustomInput 
           label='producto'
           name='producto'
           value={formData.producto}
           onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({ ...formData, producto: e.target.value });
            setFormErrors({ ...formErrors, producto: '' });
          }}
          error={formErrors.producto}
        />
        </div>
            <CustomInput 
           label='codigoDeBarra'
           name='codigoDeBarra'
           value={formData.codigoDeBarra}
           onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({ ...formData, codigoDeBarra: e.target.value });
            setFormErrors({ ...formErrors, codigoDeBarra: '' });
          }}
          error={formErrors.codigoDeBarra}
        />
        </div> 
        <CustomInput 
           label='Precio'
           name='Precio'
           value={formData.precio}
           onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({ ...formData, precio: e.target.value });
            setFormErrors({ ...formErrors, precio: '' });
          }}
          error={formErrors.Precio}
        />
         </div>
         <CustomInput 
           label='Cantidad'
           name='Cantidad'
           value={formData.cantidad}
           onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({ ...formData, cantidad: e.target.value });
            setFormErrors({ ...formErrors, cantidad: '' });
          }}
          error={formErrors.cantidad}
        />
    
    <CustomInput 
           label='Impuestos'
           name='Impuestos'
           value={formData.impuestos}
           onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({ ...formData, impuestos: e.target.value });
            setFormErrors({ ...formErrors, impuestos: '' });
          }}
          error={formErrors.impuestos}
        />
        < CustomInput 
           label='unidadDeMedida'
           name='unidadDeMedida'
           value={formData.unidadDeMedida}
           onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({ ...formData, unidadDeMedida: e.target.value });
            setFormErrors({ ...formErrors, unidadDeMedida: '' });
          }}
          error={formErrors.unidadDeMedida}
        />
 </div>
 
          <div className="d-flex flex-column col-md-4">
            <label className="title-nombre mb-2">Categoria:</label>
            <select className="form-control w-full">
              <option value=''>Elegir Categoria</option>
              <option value=''>Pendiente</option>
              {categoriaCreated.map(item => (
                <option key={item.nombreCategoria}>{item.nombreCategoria}</option>
              ))}
            </select>
          </div>
          <div className="d-flex flex-column col-md-4">
            <label className="title-nombre mb-2">Imagen:</label>
            <input className="form-control w-full"type="file"  onChange={handleFileInputChange} placeholder="Agregar Imagen"/>
          </div>
        </div>
        </div>
        <div className="d-flex justify-content-center mt-5 ">
          <button className="btn btn-dark  button-agregar"> {indexEditar !== undefined ? 'Editar producto' : 'Crear Producto' }</button>
        </div>
      </div>
    </div>
  </div>
</form>
              </div>
            </div>
          </div>
        </div>
  
    </>
  )
}

export default NuevoProducto