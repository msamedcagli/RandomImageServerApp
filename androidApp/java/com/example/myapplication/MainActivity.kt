package com.example.myapplication

import android.os.Bundle
import android.widget.Button
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import okhttp3.*
import org.json.JSONObject
import java.io.IOException
import com.squareup.picasso.Picasso

class MainActivity : AppCompatActivity() {

    private lateinit var imageView: ImageView
    private lateinit var button: Button

    private val client = OkHttpClient()
    private val serverUrl = "http://ip-address/random-image"  // Buraya kendi IP adresini yaz

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        imageView = findViewById(R.id.imageView)
        button = findViewById(R.id.button)

        button.setOnClickListener {
            fetchRandomImage()
        }
    }

    private fun fetchRandomImage() {
        val request = Request.Builder()
            .url(serverUrl)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                e.printStackTrace()
                // Buraya hata mesajı ekleyebilirsin
            }

            override fun onResponse(call: Call, response: Response) {
                if (!response.isSuccessful) {
                    // Hata durumu
                    return
                }

                val body = response.body?.string()
                val json = JSONObject(body ?: "{}")
                val imageUrl = json.optString("url", "")

                runOnUiThread {
                    if (imageUrl.isNotEmpty()) {
                        Picasso.get().load(imageUrl).into(imageView)
                    }
                }
            }
        })
    }
}
