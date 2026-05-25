import AdminCrudSimple from './AdminCrudSimple';
export default function Reclamos(){return <AdminCrudSimple titulo="Reclamos y soporte" recurso="reclamos" campos={[{name:'cliente_id',label:'ID cliente',type:'number'},{name:'asunto',label:'Asunto'},{name:'descripcion',label:'Descripción',col:'col-md-4'},{name:'estado',label:'Estado',default:'PENDIENTE'}]} />;}
