<title>SvelteKit Starter Template! By Rlabs</title>
<main>
	<div class="container">
		<div class="logo-container">
			<img class="logo" src="/svelte.avif" alt="SvelteKit Logo" />
		</div>
		<div class="content">
			<h1>SvelteKit Starter Template!</h1>
			<p>
				Thank you for choosing my SvelteKit starter template. Feel free to explore and customize the
				code to fit your needs.
			</p>
			<p>
				To see your changes, simply edit the <code>src/routes/+page.svelte</code> file and save.
			</p>

			<p>
				<span> Made by </span>
				<a href="https://rishupatel.com" target="_blank"> Rishu Patel </a>
			</p>

			<a
				class="cta"
				href="https://github.com/rlabs-digital/sveltekit-starter-base-template"
				target="_blank">View on GitHub</a
			>
		</div>
	</div>
</main>

<style lang="scss">
	main {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
	}

	.container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;

		.logo-container {
			width: 350px;
			height: 300px;
			margin-top: -140px;

			.logo {
				width: 100%;
				height: 100%;
				object-fit: contain;
			}
		}

		.content {
			h1 {
				font-weight: 600;
				margin-bottom: 0.6rem;
			}

			text-align: center;

			p {
				display: flex;
				align-items: center;
				justify-content: center;
			}

			code {
				display: inline-block;
				padding: 0.5rem 0.8rem;
				font-size: 0.9rem;
				font-family: Fira Code, monospace;
				background-color: #f8f8f8;
				color: #333;
				border-radius: 5px;
				overflow-x: auto;
				white-space: pre-wrap;
				word-wrap: break-word;
				margin: 0 4px;
			}

			.cta {
				margin-top: 1rem;
				display: inline-block;
				background-color: #000;
				color: #fff;
				font-size: 16px;
				font-weight: bold;
				text-decoration: none;
				padding: 10px 4rem;
				border-radius: 4px;
				transition: all 0.3s ease-in-out;
			}

			.cta:hover {
				background-color: #fff;
				color: #000;
				outline: 1px solid #000;
			}
		}

		a {
			color: #1976d2;
			text-decoration: none;
			transition: all 0.2s ease-in-out;
			margin-left: 4px;

			&:hover {
				color: #0d47a1;
				text-decoration: underline;
			}

			&:active {
				color: #0d47a1;
			}
		}
	}
</style>
