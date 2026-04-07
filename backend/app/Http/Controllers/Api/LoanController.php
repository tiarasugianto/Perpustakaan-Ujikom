<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Loan;
use Carbon\Carbon;

class LoanController extends Controller {
    public function store(Request $request) {
        $l = Loan::create(['user_id'=>$request->user_id,'book_id'=>$request->book_id,'status'=>'pending','borrowed_at'=>Carbon::now(),'return_date'=>$request->return_date]);
        return response()->json($l, 201);
    }
   public function index() {
    return response()->json(\App\Models\Loan::with(['user', 'book'])->latest()->get());
}

public function show($id) {
    $loan = \App\Models\Loan::with(['user', 'book'])->find($id);
    return $loan ? response()->json($loan) : response()->json(['m'=>'Gak ada'], 404);
}
    public function update(Request $request, $id) {
        $l = Loan::findOrFail($id);
        $l->update(['status'=>'returned','returned_at'=>Carbon::now()]);
        \App\Models\Book::find($l->book_id)->increment('stok');
        return response()->json(['m'=>'Sukses']);
    }
}