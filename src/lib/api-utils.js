import { NextResponse } from 'next/server';

export function successResponse(data, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(message, status = 500) {
  return NextResponse.json(
    { error: message },
    { status }
  );
}

export function notFoundResponse(resource = 'Resource') {
  return NextResponse.json(
    { error: `${resource} not found` },
    { status: 404 }
  );
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  );
}

export function forbiddenResponse() {
  return NextResponse.json(
    { error: 'Forbidden' },
    { status: 403 }
  );
}

export function badRequestResponse(message = 'Bad request') {
  return NextResponse.json(
    { error: message },
    { status: 400 }
  );
}