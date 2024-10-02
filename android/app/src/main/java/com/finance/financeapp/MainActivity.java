package com.finance.financeapp;

import com.getcapacitor.BridgeActivity;

import androidx.appcompat.app.AppCompatDelegate;

public class MainActivity extends BridgeActivity {}

@Override
protected void onCreate(Bundle savedInstanceState) {
    AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO); // Принудительно устанавливаем светлую тему
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);
}
