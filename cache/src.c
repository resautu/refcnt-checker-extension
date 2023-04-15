#include <vector>
using namespace std;
template<class T>
class Sort{
    public:
    Sort() = default;
    void quickSort(vector<T>& array, int begin, int end){
        if (begin >= end) return;
        int i = begin, j = end;
        T temp = arrayP[begin];
        while (i < j){
            while (array[j] >= temp && j > i)
                j--;
            while (array[i] <= temp && i < j)
                i++;
            if(i < j){
                T swap1 = array[i];
                array[i] = array[j];
                array[j] = swap1; 
            }
        }
        array[begin] = array[i];
        array[i] =temp;
        quickSort(array, begin, i-1);
        quickSort(array, i+1, end);
    }
};