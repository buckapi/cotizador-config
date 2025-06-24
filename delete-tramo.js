// Función global para eliminar un tramo con confirmación
window.eliminarTramo = async function(id) {
  try {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el tramo');
      }

      await Swal.fire({
        icon: 'success',
        title: '¡Eliminado!',
        text: 'El tramo ha sido eliminado correctamente',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });

      // Cerrar el detalle y recargar la lista
      ocultarDetalle();
      await cargarTramos();
    }
  } catch (error) {
    console.error('Error al eliminar tramo:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'No se pudo eliminar el tramo',
      confirmButtonText: 'Entendido'
    });
  }
}
