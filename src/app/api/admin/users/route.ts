import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

// GET: List all users (admin only)
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get all user profiles
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, created_at, last_sign_in_at')
      .order('created_at', { ascending: false });

    if (usersError) {
      throw usersError;
    }

    return NextResponse.json({
      users: users || [],
      total: users?.length || 0,
      success: true,
    });
  } catch (error) {
    console.error('Users list error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json(
      { error: `Erro ao listar usuários: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// POST: Create a new user (admin only)
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { email, password, full_name, role } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!['admin', 'veterinarian', 'technician', 'user'].includes(role || 'user')) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Create user via admin API
    const adminClient = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: full_name || email.split('@')[0],
      },
    });

    if (createError) {
      throw createError;
    }

    // Create profile record
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: newUser.user.id,
        email: newUser.user.email,
        full_name: full_name || email.split('@')[0],
        role: role || 'user',
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      throw profileError;
    }

    return NextResponse.json({
      user: {
        id: newUser.user.id,
        email: newUser.user.email,
        full_name: full_name || email.split('@')[0],
        role: role || 'user',
      },
      message: `Usuário ${email} criado com sucesso`,
      success: true,
    });
  } catch (error) {
    console.error('Create user error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

    // Check if error is due to duplicate email
    if (errorMessage.includes('already exists')) {
      return NextResponse.json(
        { error: 'Usuário com este email já existe' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: `Erro ao criar usuário: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// DELETE: Delete a user (admin only)
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { user_id } = await req.json();

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Prevent admin from deleting themselves
    if (user_id === user.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Delete user via admin API
    const adminClient = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user_id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({
      message: `Usuário ${user_id} deletado com sucesso`,
      success: true,
    });
  } catch (error) {
    console.error('Delete user error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json(
      { error: `Erro ao deletar usuário: ${errorMessage}` },
      { status: 500 }
    );
  }
}
