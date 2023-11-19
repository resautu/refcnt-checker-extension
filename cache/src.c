#include <Python.h>

int test(){
    PyObject *item = PyList_New(2);
    while(1){
        Py_DECREF(item);
    }
    
    return 0;
}