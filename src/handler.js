const { nanoid } = require("nanoid");
const notes = require("./notes");

//Menambahkan Catatan 
const addNoteHandler = (request, h) => {
    const {title, tags, body} = request.payload;

    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
        title, tags, body, id, createdAt, updatedAt
    };

    notes.push(newNote);

    const isSuccess = notes.filter((note) => note.id === id).length > 0;

    if(isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                noteId: id,
            },
        });
        response.code(201);
        return response;
    }
    
    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
    });
    response.code(500);
    return response;
};

//Menampilkan Seluruh Catatan 
const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    },
});

//Menampilkan salah satu catatan(spesifik) berdasarkan id
const getNoteByIdHandler = (request, h) => {
    const { id } = request.params;
    
    //cari catatan yang punya id sama persis, filter ini array hasilnya, jadi pakai index ke 0 untuk ambil hasil pertama dari daftar
    const note = notes.filter((n) => n.id === id)[0];

    if(note !== undefined) {
        return {
            status: 'success',
            data: {
                note,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
    });
    response.code(404);
    return response;
}


//Edit Catatan
const editNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const { title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();

    //cari id notes dengan indexing array
    const index = notes.findIndex((note) => note.id === id);

    //jika index tdk ditemukan maka nilainya -1
    if(index !== -1) {
        notes[index] = {
            ...notes[index], //data notes[index] yaitu data lama kita timpa dengan data yg baru yaitu ...notes[index]
            title,
            tags,
            body,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil diperbarui'
        });
        response.code(200);
        response.header('Location', '/'); //redirect ke halaman utama
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal diperbarui!'
    });
    response.code(404);
    return response;
}

//Menghapus Catatan
const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = notes.findIndex((note) => note.id === id);

    if(index !== -1) {
        notes.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil di hapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
}

module.exports = {addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler}