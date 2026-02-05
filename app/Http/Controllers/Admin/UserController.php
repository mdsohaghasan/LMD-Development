<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::paginate(20);

        return $this->renderInertia('Admin/Users/Index', [
            'users' => $users,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'role' => 'required|in:admin,teacher,student,user',
        ]);

        $user->role = $data['role'];
        $user->save();

        return redirect()->back()->with('success', 'User role updated.');
    }
}
